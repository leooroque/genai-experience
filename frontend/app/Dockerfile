FROM python:3.9-slim

WORKDIR /app

ENV API_BASE_URL='http://santander-experience-backend-service'

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "santander-experience.py"]
