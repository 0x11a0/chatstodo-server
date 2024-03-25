ARG PYTHON_VERSION=3.11.8

# Builder stage
FROM python:${PYTHON_VERSION}-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:${PYTHON_VERSION}-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY ./app /app
EXPOSE 8002
CMD ["python", "-u", "main.py"]
