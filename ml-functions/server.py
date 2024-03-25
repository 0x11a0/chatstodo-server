from openai_helper import OpenAiHelper
import chatstodo_ml_service_pb2
import chatstodo_ml_service_pb2_grpc
from google.protobuf import timestamp_pb2
import grpc
from concurrent import futures
import logging
import json
import os
from dotenv import load_dotenv
load_dotenv()

port = os.getenv('ML_PORT')
logging.basicConfig(level=logging.INFO)


class ChatAnalysisServiceImpl(chatstodo_ml_service_pb2_grpc.ChatAnalysisServiceServicer):
    def __init__(self):
        self.openai_helper = OpenAiHelper()

    def AnalyzeChat(self, request, context):
        print("Request coming in", request)

        # Extract chat messages from request
        chat_messages = [
            chat_message.chat_message for chat_message in request.message_text]
        user_id = request.user_id

        processed_chat = ""

        ts = timestamp_pb2.Timestamp()
        ts.GetCurrentTime()

        response = chatstodo_ml_service_pb2.ChatAnalysisResponse(
            userID=user_id,
            timestamp=ts,
            summary=[],
            tasks=[],
            events=[]
        )

        # Process the messages
        try:
            processed_chat = self.openai_helper.analyze_chat(
                user_id, chat_messages)
            processed_chat = json.loads(processed_chat)

            if processed_chat:
                summary = processed_chat.get("Summary")
                tasks = processed_chat.get("Tasks")
                events_dicts = processed_chat.get("Events", [])

                # Update response
                response.summary.extend(summary)
                response.tasks.extend(tasks)

                # Convert each dictionary into an EventDetail Message
                for event_dict in events_dicts:
                    event_message = chatstodo_ml_service_pb2.EventDetail(
                        event=event_dict.get('event', ''),
                        location=event_dict.get('location', ''),
                        date=event_dict.get('date', ''),
                        time=event_dict.get('time', ''),
                    )
                    # Update response
                    response.events.append(event_message)

        except Exception as e:
            logging.error(f"Error processing request: {e}")

        return response


def serve():
    # Have a threadpool of 10
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    chatstodo_ml_service_pb2_grpc.add_ChatAnalysisServiceServicer_to_server(
        ChatAnalysisServiceImpl(), server)
    print(f"ML Server is running on port {port}")
    server.add_insecure_port('[::]:' + str(port))
    try:
        server.start()
        server.wait_for_termination()
    except Exception as e:
        logging.error(f"Error in server: {e}")


if __name__ == '__main__':
    serve()
