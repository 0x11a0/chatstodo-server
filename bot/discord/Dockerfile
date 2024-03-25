ARG PYTHON_VERSION=3.11.8
FROM python:${PYTHON_VERSION}-slim as base

WORKDIR /app

# Copy the source code into the container.
COPY ./app /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port that the application listens on.
EXPOSE 8002

# Run the application.
CMD ["python", "-u", "main.py"]