#!/bin/sh
set -e

echo "Starting deployment script..."

# Simple wait to ensure DB is likely up (Render usually handles this, but 5s safety margin)
echo "Waiting 5s for DB..."
sleep 5

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Collecting static files (if any)..."
# python manage.py collectstatic --noinput || true  <-- Descomentar si usas static files en backend

echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}