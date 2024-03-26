FROM python:3.9-slim

# Allow statements and log messages to appear in Knative
ENV PYTHONUNBUFFERED True
ENV PORT 8080

EXPOSE 8080

# Copy local code to container image
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# Install production dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the server
CMD ["python", "server.py"]