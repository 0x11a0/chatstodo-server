from openai import OpenAI
from datetime import datetime


class OpenAiHelper:
    def __init__(self, model='gpt-3.5-turbo-0125'):
        # Default instantiates to take the key using os.get("OPENAI_API_KEY")
        self.client = OpenAI()
        self.model = model

    def get_response(self, prompt):
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                seed=1
            )
            print(response.choices[0].message.content)
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error getting response from OpenAI: {e}")
            return ""

    def get_prompt(self):

        file_name = "prompt.txt"
        prompt = ""

        try:
            with open(file_name, 'r') as file:
                prompt += file.read()
        except Exception as e:
            print(f"Error: {e}")
        return prompt

    def analyze_chat(self, user_id, chat_messages):
        try:
            prompt = self.get_prompt()
            prompt = prompt.replace("{username}", str(user_id))
            prompt = prompt.replace(
                "{today_date}", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

            chat_messages_str = "\n".join(chat_messages)
            prompt_with_chat_message = f"{prompt}\n\n{chat_messages_str}"
        except Exception as e:
            print(f"Error: {e}")
        return self.get_response(prompt_with_chat_message)
