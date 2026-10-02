FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download the VADER sentiment lexicon
RUN python -m nltk.downloader -d /usr/share/nltk_data vader_lexicon

ENV NLTK_DATA=/usr/share/nltk_data
ENV PORT=5050

COPY . .

EXPOSE 5050

CMD ["python", "app.py"]