from flask import Flask
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
nltk.data.path.insert(0, os.path.expanduser("~/nltk_data"))

app = Flask("Sentiment Analyzer")
sia = SentimentIntensityAnalyzer()

@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):
    scores = sia.polarity_scores(input_txt)
    print(scores)

    compound = float(scores['compound'])

    if compound >= 0.05:
        res = "positive"
    elif compound <= -0.05:
        res = "negative"
    else:
        res = "neutral"

    result = json.dumps({"sentiment": res})
    print(result)
    return result

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5050, debug=True)
