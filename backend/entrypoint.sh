#!/bin/sh
set -e

# Wait for Postgres to be ready
python - <<'PY'
import socket, time, os
host = os.environ.get('DB_HOST', 'db')
port = int(os.environ.get('DB_PORT', 5432))
delay = 1
while True:
    try:
        s = socket.create_connection((host, port), 2)
        s.close()
        break
    except Exception:
        print('Waiting for Postgres...')
        time.sleep(delay)
PY

# Apply migrations
python manage.py makemigrations
python manage.py migrate --noinput

# Create superuser if credentials provided (optional)
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
  python manage.py createsuperuser --noinput || true
fi

# Start gunicorn
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000