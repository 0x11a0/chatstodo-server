import os
from os.path import join, dirname
import requests
from dotenv import load_dotenv
import datetime
import json

from confluent_kafka import Producer  # for kafka producer
from telebot.async_telebot import AsyncTeleBot
from telebot import types
import asyncio

from bot.commands import COMMANDS
from db.mongodb import MongoDBHandler

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
UPSTASH_KAFKA_SERVER = os.getenv("UPSTASH_KAFKA_SERVER")
UPSTASH_KAFKA_USERNAME = os.getenv('UPSTASH_KAFKA_USERNAME')
UPSTASH_KAFKA_PASSWORD = os.getenv('UPSTASH_KAFKA_PASSWORD')
SKIP_UPDATES = os.getenv('TELEGRAM_SKIP_UPDATES') == 1
GROUP_MONGODB_URL = os.getenv('MONGODB_URL')

topic = 'chat-messages'
conf = {
    'bootstrap.servers': UPSTASH_KAFKA_SERVER,
    'sasl.mechanisms': 'SCRAM-SHA-256',
    'security.protocol': 'SASL_SSL',
    'sasl.username': UPSTASH_KAFKA_USERNAME,
    'sasl.password': UPSTASH_KAFKA_PASSWORD
}

producer = Producer(**conf)

bot = AsyncTeleBot(BOT_TOKEN, parse_mode="HTML")

groups_db = MongoDBHandler(db_url=GROUP_MONGODB_URL)


# kafka acked definition
def acked(err, msg):
    if err is not None:
        print(f"Failed to deliver message: {err.str()}")
    else:
        print(f"Message produced: {msg.topic()}")


async def skip_pending_updates(bot):
    print("Skipping older updates")
    updates = await bot.get_updates()
    if updates:
        last_update_id = updates[-1].update_id
        await bot.get_updates(offset=last_update_id + 1)


@bot.message_handler(commands=["start"])
async def handle_start(message):
    reply = COMMANDS["start"]["message"]
    await bot.reply_to(message, f"Hello, {message.from_user.first_name}!\n\n" + reply)


@bot.message_handler(commands=["connect"], func=lambda message: message.chat.type in ["private"])
async def handle_connect_to_chatstodo(message):
    api_url = "http://authentication:8080/auth/api/v1/bot/request-code"
    user_credentials = {"userId": str(
        message.from_user.id), "platform": "Telegram"}
    response = requests.post(api_url, json=user_credentials)
    x = response.json()
    code = x["verification_code"]
    await bot.reply_to(message, f"Here is your code {code}")


@bot.message_handler(commands=["track"], func=lambda message: message.chat.type in ["group", "supergroup"])
async def handle_track_group(message):
    group_id = message.chat.id
    group_name = message.chat.title
    user_id = message.from_user.id

    group_data = {
        "user_id": str(user_id),
        "group_id": str(group_id),
        "group_name": str(group_name),
        "platform": "Telegram",
        "created_at": datetime.datetime.now(datetime.UTC).isoformat()
    }

    does_user_belong_to_group = await check_user_belongs_to_group(user_id, group_id, groups_db, bot)

    if does_user_belong_to_group:
        print(
            f"An entry with user id {user_id} and group id {group_id} already exists in the database.")
        await bot.send_message(user_id, f"You have already added '{group_name}' to your tracking list")
    else:
        groups_db.insert_group(group_data)
        # send a pm to the user
        await bot.send_message(user_id, f"You have added '{group_name}' to your tracking list")


async def check_user_belongs_to_group(user_id, group_id, groups_db, bot):
    user_id_str = str(user_id)
    group_id_str = str(group_id)
    group = groups_db.get_a_group(
        user_id_str, group_id_str, platform="Telegram")

    if group:
        try:
            member = await bot.get_chat_member(group_id, user_id)

            if member:
                # get the group name and add it to the list
                updated_group = await bot.get_chat(group_id)

                # update the new group name in the db if it is not the same as db
                if updated_group.title != group["group_name"]:
                    groups_db.update_group(
                        group_id_str, user_id_str, updated_group.title)

                return True

        except Exception as e:
            print(f"Error getting chat member: {e}")
            groups_db.delete_group_of_user(group_id_str, user_id_str)

    return False


async def refresh_groups(user_id, groups_db, bot):
    user_id = str(user_id)
    groups = groups_db.get_groups_of_user(user_id)
    current_groups = []

    # for loop the groups in db and check if the user is still in the group
    # if not, remove the group from the db
    for group in groups:
        group_id = group["group_id"]
        try:
            await bot.get_chat_member(group_id, user_id)
            # get the group name and add it to the list
            updated_group = await bot.get_chat(group_id)
            group["group_name"] = updated_group.title
            current_groups.append(group)

            # update the new group name in the db if it is not the same as db
            if updated_group.title != group["group_name"]:
                groups_db.update_group(group_id, user_id, updated_group.title)

        except Exception as e:
            print(f"Error getting chat member: {e}")
            groups_db.delete_group_of_user(group_id, user_id)

    return current_groups


@bot.message_handler(commands=["viewGroups"], func=lambda message: message.chat.type in ["private"])
async def handle_groups(message):
    user_id = str(message.from_user.id)
    current_groups = await refresh_groups(user_id, groups_db, bot)

    if current_groups:
        reply = "Here are the groups you are tracking:\n"
        for group in current_groups:
            reply += f"- {group['group_name']}\n"
    else:
        reply = "You are not tracking any groups yet"

    await bot.reply_to(message, reply)


@bot.message_handler(commands=["deleteGroups"], func=lambda message: message.chat.type == "private")
async def handle_delete_groups(message):
    user_id = str(message.from_user.id)
    current_groups = await refresh_groups(user_id, groups_db, bot)

    if not current_groups:
        await bot.reply_to(message, "You are not tracking any groups yet.")
        return

    markup = types.InlineKeyboardMarkup(row_width=2)
    for group in current_groups:
        callback_data = f"deleteGroup_{group['group_id']}"
        button = types.InlineKeyboardButton(
            group['group_name'], callback_data=callback_data)
        markup.add(button)

    cancel_button = types.InlineKeyboardButton(
        "Cancel", callback_data="deleteGroup_cancel")
    markup.add(cancel_button)

    await bot.reply_to(message, "Select a group to remove:", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: call.data.startswith("deleteGroup"))
async def handle_delete_group(call):
    if call.data == "deleteGroup_cancel":
        await bot.edit_message_text(chat_id=call.message.chat.id,
                                    message_id=call.message.message_id,
                                    text="Cancelled delete operation.",
                                    reply_markup=None)
        return
    group_id = str(call.data.split("deleteGroup_")[1])
    user_id = str(call.from_user.id)

    # Assuming the delete_group_of_user method returns a boolean indicating success
    count = groups_db.delete_group_of_user(
        group_id, user_id, platform="Telegram")

    if count > 0:
        # Notify the user that the group has been removed
        await bot.answer_callback_query(call.id, "Group removed")

        # Edit the message to remove the inline keyboard
        await bot.edit_message_text(chat_id=call.message.chat.id,
                                    message_id=call.message.message_id,
                                    text="Group removed successfully.",
                                    reply_markup=None)
    else:
        await bot.answer_callback_query(call.id, "Failed to remove group.")


# listen to the supergroup and group chat leaving then delete the users that leave that group id
@bot.message_handler(content_types=["left_chat_member"], func=lambda message: message.chat.type in ["group", "supergroup"])
async def handle_left_chat_member(message):
    group_id = str(message.chat.id)
    user_id = str(message.left_chat_member.id)

    count = groups_db.delete_group_of_user(
        group_id, user_id, platform="Telegram")
    if count > 0:
        print(
            f"Telegram: User {user_id} has left the group {group_id}, removed from tracking list")


@bot.message_handler(commands=["help"])
async def handle_help(message):
    reply = COMMANDS["help"]["message"]
    await bot.reply_to(message, reply)


@bot.message_handler(commands=["summary"], func=lambda message: message.chat.type in ["private"])
async def handle_summary(message):
    await bot.reply_to(message, "summary")


@bot.message_handler(commands=["feedbacks"], func=lambda message: message.chat.type in ["private"])
async def handle_feedbacks(message):
    await bot.reply_to(message, "feedbacks")


@bot.message_handler(func=lambda message: message.chat.type in ["group", "supergroup"])
async def listen_to_group_messages(message):
    kafka_parcel = {
        "platform": "Telegram",
        "sender_name": message.from_user.first_name,
        "group_id": message.chat.id,
        "timestamp": datetime.datetime.now(datetime.UTC).isoformat(),
        "message": message.text
    }

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


async def main():
    print("Starting bot...")

    if not SKIP_UPDATES:
        await skip_pending_updates(bot)
    print("Bot is running!")

    await asyncio.gather(bot.infinity_polling())

# entry point
if __name__ == '__main__':
    asyncio.run(main())
