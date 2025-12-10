FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /code
COPY requirements.txt /code/requirements.txt

# Install build deps and dos2unix to normalize line endings, then install pip deps
RUN apt-get update \
	&& apt-get install -y --no-install-recommends dos2unix gcc libpq-dev \
	&& pip install --upgrade pip \
	&& pip install -r /code/requirements.txt

COPY . /code
RUN if [ -f /code/entrypoint.sh ]; then dos2unix /code/entrypoint.sh || true; fi \
	&& chmod +x /code/entrypoint.sh || true
EXPOSE 8000
CMD ["/code/entrypoint.sh"]
