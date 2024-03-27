from discord.ext import commands, tasks  # for bot commands and tasks
import discord  # for discord API
import datetime  # for timestamp
from dotenv import load_dotenv  # for environment variables
import os  # for environment variables
from os.path import join, dirname, exists
import json  # for json dump
from confluent_kafka import Producer  # for kafka producer
import sys  # for sys.exit
import requests  # for requests
from db.mongodb import MongoDBHandler  # for mongodb
import jwt

# load the environment variables
dotenv_path = join(dirname(__file__), '.env')
load_dotenv()

# bot env var
BOT_TOKEN = os.getenv('DISCORD_BOT_TOKEN')

# mongodb env var
GROUP_MONGODB_URL = os.getenv('MONGODB_URL')
JWT_SECRET = os.getenv("JWT_SECRET_KEY")

# kafka env var
topic = 'chat-messages'
UPSTASH_KAFKA_SERVER = os.getenv("UPSTASH_KAFKA_SERVER")
UPSTASH_KAFKA_USERNAME = os.getenv('UPSTASH_KAFKA_USERNAME')
UPSTASH_KAFKA_PASSWORD = os.getenv('UPSTASH_KAFKA_PASSWORD')


conf = {
    'bootstrap.servers': UPSTASH_KAFKA_SERVER,
    'sasl.mechanisms': 'SCRAM-SHA-256',
    'security.protocol': 'SASL_SSL',
    'sasl.username': UPSTASH_KAFKA_USERNAME,
    'sasl.password': UPSTASH_KAFKA_PASSWORD
}

producer = Producer(**conf)

groups_db = MongoDBHandler(db_url=GROUP_MONGODB_URL)


# kafka acked definition
def acked(err, msg):
    if err is not None:
        print(f"Failed to deliver message: {err.str()}")
    else:
        print(f"Message produced: {msg.topic()}")


# define the prefix for the bot commands
bot = commands.Bot(command_prefix='/', intents=discord.Intents.all())
# ------------------------------------------------- DISCORD EVENTS -----------------------------------------------------


# BOT READY CHECK ON CONSOLE
@bot.event
async def on_ready():
    # send message to console when bot is ready
    print('Logged in as')
    print(bot.user.name)
    print('Console Check: ChatsTodo Bot is Ready')


# MESSAGE LISTENER TO KAFKA
@bot.event
async def on_message(message):
    # we do not want the bot to reply to itself
    if message.author.id == bot.user.id:
        return

    # this line is important for bot commands to work,
    # otherwise it will not recognise commands as
    # it will not process them and only reads the message
    await bot.process_commands(message)

    # check if message is a command, if so return
    if message.content.startswith(bot.command_prefix):
        return

    # send message to kafka
    platform = "Discord"
    sender_name = message.author.name
    group_id = message.guild.id
    message = message.content

    kafka_parcel = {"platform": platform, "sender_name": sender_name,
                    "group_id": group_id, "message": message}
    kafka_parcel_string = json.dumps(kafka_parcel)

    try:
        producer.produce(topic, kafka_parcel_string, callback=acked)
        producer.poll(1)
    except Exception as e:
        print(f"Error producing message: {e}")
        # need to handle if cannot send to kafka what to do,
        # now it is an infinite loop that keeps trying to send to kafka
        # sys.exit(f"Error producing message: {e}")

    producer.flush()

# ------------------------------------------------- DISCORD COMMANDS -----------------------------------------------------


# ping command
@bot.command()
async def ping(ctx):
    await ctx.send('Pong!')


# start command
@bot.command()
async def start(ctx):
    await ctx.send('Hello! I am ChatsTodo Bot. I am here to help you with your tasks.\n'
                   'Here are the commands you can use:\n'
                   '!ping - Pong!\n')


# connect command
@bot.command()
async def connect(ctx):
    # Check if the command is issued in a private channel
    if isinstance(ctx.channel, discord.DMChannel):
        api_url = ""
        try:
            api_url = os.environ.get("INTERNAL_URL_GET_VERIFICATION_CODE")
        except Exception as e:
            await ctx.send("Currently we are facing difficulties generating the code. Please try again later.")

        user_credentials = {"userId": str(ctx.author.id), "userName":
                            ctx.author.name, "platform": "Discord"}
        response = requests.post(api_url, json=user_credentials)
        x = response.json()
        code = x["verification_code"]
        await ctx.send(f"Here is your code {code}")


# TODO: IMPLEMENT REFRESH SUMMARY
# ERROR HERE
@bot.command()
async def refresh(ctx):
    if isinstance(ctx.channel, discord.DMChannel):
        api_url = ""
        try:
            api_url = os.environ.get("INTERNAL_URL_REFRESH")
        except Exception as e:
            await ctx.send("Currently we are facing difficulties getting summaries. Please try again later.")

        user_id = str(ctx.author.id)
        user_name = ctx.author.name
        platform = "Discord"
        payload = {"credentialId": user_id,
                   "credentialName": user_name, "platformName": platform}

        jwt_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        headers = {"Authorization": f"Bearer {jwt_token}"}

        response = requests.get(api_url, headers=headers)
        x = response.json()

        # when there is a response and the message in it
        if x and "message" in x:
            await ctx.send("Successfully refresh! Please check again with /summary")
            return

        await ctx.send("There are no updates")


# summary command
@bot.command()
async def summary(ctx):
    if isinstance(ctx.channel, discord.DMChannel):
        api_url = ""
        try:
            api_url = os.environ.get("INTERNAL_URL_GET_ALL_DATA")
        except Exception as e:
            await ctx.send("Currently we are facing difficulties getting summaries. Please try again later.")

        user_id = str(ctx.author.id)
        user_name = ctx.author.name
        platform = "Discord"
        payload = {"credentialId": user_id,
                   "credentialName": user_name, "platformName": platform}

        jwt_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        headers = {"Authorization": f"Bearer {jwt_token}"}

        response = requests.get(api_url, headers=headers)
        x = response.json()

        await ctx.send(x["message"])


# track command
@bot.command()
async def track(ctx):
    if isinstance(ctx.guild, discord.Guild):  # Check if the command is issued in a guild
        guild_id = ctx.guild.id
        guild_name = ctx.guild.name
        user_id = ctx.author.id

        guild_data = {
            "user_id": str(user_id),
            "group_id": str(guild_id),
            "group_name": str(guild_name),
            "platform": "Discord",
            "created_at": datetime.datetime.now(datetime.UTC)
        }

        does_user_exist_in_guild = await check_user_exists_in_guild(user_id, guild_id, groups_db, bot)

        # check if guild_id exists in the current_groups list of objects
        if does_user_exist_in_guild:
            print(
                f"An entry with user id {user_id} and group id {guild_id} already exists in the database.")
            await ctx.author.send(f"You are already tracking '{guild_name}'")
        else:
            groups_db.insert_group(guild_data)

            # send a pm to the user
            await ctx.author.send(f"You have added '{guild_name}' to your tracking list")


async def check_user_exists_in_guild(user_id, group_id, groups_db, bot):
    user_id_str = str(user_id)
    group_id_str = str(group_id)
    group = groups_db.get_a_group(user_id_str, group_id_str, "Discord")

    print(group)
    if group:
        guild = bot.get_guild(group_id)
        print(guild)
        if guild:
            try:
                member = await guild.fetch_member(user_id)
                print(member)

                # member does exist in the guild
                if member:
                    if guild.name != group["group_name"]:
                        groups_db.update_group(
                            group_id_str, user_id_str, guild.name)
                    return True

            except discord.NotFound:
                groups_db.delete_group_of_user(
                    group_id_str, user_id_str, "Discord")

    return False


# view groups command
async def refresh_groups(user_id, groups_db, bot):
    print("refreshing groups")
    user_id = str(user_id)
    groups = groups_db.get_groups_of_user(user_id)
    current_groups = []

    # for loop the groups in db and check if the user is still in the group
    # if not, remove the group from the db
    for group in groups:
        group_id = int(group["group_id"])
        guild = bot.get_guild(group_id)

        if guild:
            try:
                member = await guild.fetch_member(user_id)
                if member:
                    current_groups.append(group)

                    if guild.name != group["group_name"]:
                        groups_db.update_group(
                            group_id, str(user_id), guild.name)
            except discord.NotFound:
                groups_db.delete_group_of_user(
                    group_id, str(user_id), "Discord")

    return current_groups


@bot.command()
async def viewGroups(ctx):
    # Check if the command is issued in a private channel
    if isinstance(ctx.channel, discord.DMChannel):
        user_id = ctx.author.id
        print("test")
        current_groups = await refresh_groups(user_id, groups_db, bot)

        if current_groups:
            reply = "Here are the groups you are tracking:\n"
            for group in current_groups:
                reply += f"- {group['group_name']}\n"
                print(reply)
        else:
            reply = "You are not tracking any groups yet"

        await ctx.send(reply)

# delete group command


@bot.command()
async def deleteGroups(ctx):
    # Check if the command is issued in a private channel
    if isinstance(ctx.channel, discord.DMChannel):
        user_id = ctx.author.id
        current_groups = await refresh_groups(user_id, groups_db, bot)

        if not current_groups:
            await ctx.send("You are not tracking any groups yet.")
            return

        for group in current_groups:
            await ctx.send(f"Do you want to remove '{group['group_name']}'? Type '/confirmDelete {group['group_id']}' to confirm.")


@bot.command()
async def confirmDelete(ctx, group_id: int):
    # Check if the command is issued in a private channel
    if isinstance(ctx.channel, discord.DMChannel):
        user_id = ctx.author.id

        # Assuming the delete_group_of_user method returns a boolean indicating success
        count = groups_db.delete_group_of_user(
            str(group_id), str(user_id), platform="Discord")

        if count > 0:
            # Notify the user that the group has been removed
            await ctx.send("Group removed successfully.")
        else:
            await ctx.send("Failed to remove group.")


@bot.event
async def on_member_remove(member):
    user_id = member.id
    guild_id = member.guild.id

    # Check if the user and guild ID exist in the database
    group = groups_db.get_groups_of_user(
        str(guild_id), str(user_id), platform="Discord")

    # If the group exists, delete it
    if group:
        groups_db.delete_group_of_user(
            str(guild_id), str(user_id), platform="Discord")

# run the bot with the provided token
bot.run(BOT_TOKEN)
