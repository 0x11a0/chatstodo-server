## Discord Bot

This project is a Discord bot that reads messages on the discord server/channel indicated by CHANNEL_ID and sends them to kafka.

### Setup

1. Navigate to the discord directory containing bot.py:

   ```bash
   cd discord/
   ```

2. Create a virtual environment and install the required packages:

   ```bash
   pip install virtualenv  # or python3 -m pip install virtualenv
   virtualenv venv  # or python3 -m venv venv

   # For macOS/Linux users:
   source venv/bin/activate

   # For Windows users (use command prompt, not PowerShell):
   venv\Scripts\activate.bat

   pip install -r requirements.txt
   ```

3. Copy the `.env.example` file, rename it to `.env`, and fill in the environment variables. The environment variables are used for ...

   ```bash
   cp .env.example .env
   ```

4. Run the bot:

   ```bash
   python3 bot.py
   ```

5. The bot should now be online on the Discord server. To stop the bot, use Ctrl+C in the terminal.

### Other issues

If you face SSL issues, run the following command:

```
pip install --upgrade certifi
python -m certifi
export SSL_CERT_FILE=$(python -m certifi)
```
