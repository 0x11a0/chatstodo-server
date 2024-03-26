import telebot  # This is the library for pyTelegramBotAPI
import json
from telebot.types import BotCommand

# Load commands from the JSON file
with open("content/commands.json", "r") as file:
    COMMANDS = json.load(file)

# Function to set commands using pyTelegramBotAPI


async def set_commands(bot):
    commands = []
    for command, info in COMMANDS.items():
        commands.append(BotCommand(command, info["description"]))

    try:
        bot.set_my_commands(commands)
        print("Commands set successfully.")
    except Exception as e:
        print(f"Failed to set commands: {e}")
