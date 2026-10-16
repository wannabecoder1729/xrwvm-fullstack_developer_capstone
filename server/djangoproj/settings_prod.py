import os
from .settings import *

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = False

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        "DJANGO_ALLOWED_HOSTS",
        ".codeengine.appdomain.cloud"
    ).split(",")
    if host.strip()
]

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "DJANGO_CSRF_TRUSTED_ORIGINS", ""
    ).split(",")
    if origin.strip()
]

ROOT_URLCONF = "djangoproj.urls_prod"

MIDDLEWARE.insert(
    1, "whitenoise.middleware.WhiteNoiseMiddleware"
)

TEMPLATES[0]["DIRS"] = [
    BASE_DIR / "frontend" / "build",
    BASE_DIR / "frontend" / "static",
]

STATICFILES_DIRS = [
    BASE_DIR / "frontend" / "static",
    BASE_DIR / "frontend" / "build" / "static",
]

STATIC_ROOT = BASE_DIR / "collected_static"
STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"
