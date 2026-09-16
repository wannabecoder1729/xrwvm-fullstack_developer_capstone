from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class CarModel(models.Model):
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'WAGON'
    COUPE = 'Coupe'
    CONVERTIBLE = 'Convertible'
    HATCHBACK = 'Hatchback'
    PICKUP = 'Pickup'
    VAN = 'Van'

    CAR_TYPES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'WAGON'),
        (COUPE, 'Coupe'),
        (CONVERTIBLE, 'Convertible'),
        (HATCHBACK, 'Hatchback'),
        (PICKUP, 'Pickup'),
        (VAN, 'Van'),
    ]

    car_make = models.ForeignKey(
        CarMake,
        on_delete=models.CASCADE,
        related_name='car_models'
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPES)
    year = models.IntegerField(
        validators=[
            MinValueValidator(2015),
            MaxValueValidator(2023)
        ]
    )

    def __str__(self):
        return self.name
