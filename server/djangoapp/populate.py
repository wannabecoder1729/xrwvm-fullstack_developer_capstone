import json
from pathlib import Path

from django.db import transaction
from .models import CarMake, CarModel


@transaction.atomic
def initiate():
    data_file = (
        Path(__file__).resolve().parent.parent
        / "database" / "data" / "car_records.json"
    )

    with data_file.open(encoding="utf-8") as file:
        records = json.load(file)["cars"]

    makes_created = 0
    models_created = 0
    skipped = 0

    for record in records:
        make_name = record.get("make")
        model_name = record.get("model")
        car_type = record.get("bodyType")
        year = record.get("year")

        if not all([make_name, model_name, car_type, year]):
            skipped += 1
            continue

        if car_type not in dict(CarModel.CAR_TYPES):
            skipped += 1
            continue

        if not 2015 <= int(year) <= 2023:
            skipped += 1
            continue

        make, created = CarMake.objects.get_or_create(
            name=make_name,
            defaults={"description": f"{make_name} vehicles"}
        )
        makes_created += int(created)

        _, created = CarModel.objects.get_or_create(
            car_make=make,
            name=model_name,
            year=int(year),
            defaults={"type": car_type}
        )
        models_created += int(created)

    print(
        f"Car data import complete. "
        f"Makes created: {makes_created}, "
        f"models created: {models_created}, "
        f"records skipped: {skipped}"
    )
