import os
from urllib.parse import quote

import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    "backend_url",
    "http://127.0.0.1:3030"
)

sentiment_analyzer_url = os.getenv(
    "sentiment_analyzer_url",
    "http://127.0.0.1:5050/"
)


def get_request(endpoint, **kwargs):
    request_url = backend_url + endpoint
    response = requests.get(request_url, **kwargs)
    response.raise_for_status()
    return response.json()


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url.rstrip("/") + "/analyze/" + quote(text, safe="")
    response = requests.get(request_url)
    response.raise_for_status()
    return response.json()


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    response = requests.post(request_url, json=data_dict)
    response.raise_for_status()
    return response.json()
