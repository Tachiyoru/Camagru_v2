FROM python:3.11-slim

WORKDIR /backend

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

ENV PYTHONPATH=/backend

CMD ["watchmedo", "auto-restart", "--patterns=*.py", "--recursive", "--", "python", "-u", "server/server.py"]

# CMD ["python", "server/server.py"]
