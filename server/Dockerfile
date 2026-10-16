FROM node:20-bullseye-slim AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=djangoproj.settings_prod

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY --from=frontend-build /app/frontend/build ./frontend/build

RUN DJANGO_SECRET_KEY=build-only-placeholder python manage.py collectstatic --noinput

EXPOSE 8080

CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py shell -c 'from djangoapp.populate import initiate; initiate()' && gunicorn djangoproj.wsgi:application --bind 0.0.0.0:8080"]
