import json

from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .restapis import get_request, post_review, analyze_review_sentiments


@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data["userName"]
    password = data["password"]

    user = authenticate(username=username, password=password)

    data = {"userName": username}

    if user is not None:
        login(request, user)
        data = {
            "userName": username,
            "status": "Authenticated"
        }

    return JsonResponse(data)


@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({"status": "Logged out"})


def get_dealerships(request, state=None):
    if state:
        dealerships = get_request(
            "/fetchDealers/" + state
        )
    else:
        dealerships = get_request("/fetchDealers")

    return JsonResponse(dealerships, safe=False)


def get_dealer_details(request, dealer_id):
    dealership = get_request(
        "/fetchDealer/" + str(dealer_id)
    )

    return JsonResponse(dealership, safe=False)


def get_dealer_reviews(request, dealer_id):
    reviews = get_request(
        "/fetchReviews/dealer/" + str(dealer_id)
    )

    return JsonResponse(reviews, safe=False)


def get_cars(request):
    cars = []

    for car in CarModel.objects.select_related("car_make").all():
        cars.append({
            "CarMake": car.car_make.name,
            "CarModel": car.name
        })

    return JsonResponse({
        "CarModels": cars
    })


@csrf_exempt
def add_review(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405
        )

    data = json.loads(request.body)

    sentiment = analyze_review_sentiments(
        data.get("review", "")
    )

    data["sentiment"] = sentiment.get(
        "sentiment", ""
    )

    result = post_review(data)

    return JsonResponse(result, safe=False)
