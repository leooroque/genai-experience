FROM python:3.9-slim

WORKDIR /app

ENV API_BASE_URL='YOUR_BASE_URL'

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "santander-experience.py"]
