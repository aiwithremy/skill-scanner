FROM python:3.11-slim

WORKDIR /app

COPY scanner/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY scanner/app.py .

EXPOSE 8000

CMD ["python", "app.py"]
