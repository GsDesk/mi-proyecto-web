# Normativas Ingeniería de Software - Proyecto

Proyecto fullstack: Django (DRF) backend y Expo React Native frontend. Postgres en Docker para la base de datos y volumen para archivos (media).

## Estructura del proyecto

- backend/  (Django + DRF)
- frontend/ (Expo React Native)
- docker-compose.yml

## Requisitos locales

- Docker y Docker Compose
- Node.js (para Expo)
- Python 3.10+

## Pasos de configuración

1. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env` y ajusta las variables según sea necesario:
   ```bash
   cp .env.example .env
   ```

2. **Levantar la base de datos y backend con Docker Compose**:
   ```powershell
   cd project
   docker-compose up -d
   ```

3. **Ejecutar migraciones y crear superusuario (backend)**:
   ```powershell
   # Ejecutar migraciones
   docker-compose exec backend python manage.py migrate
   
   # Crear superusuario (opcional)
   docker-compose exec backend python manage.py createsuperuser
   ```

4. **Instalar dependencias del frontend**:
   ```powershell
   cd frontend
   npm install
   ```

5. **Iniciar el servidor de desarrollo del frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

## Acceso a la aplicación

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/
- pgAdmin: http://localhost:8080

## Credenciales por defecto

- Superusuario Django: admin / admin (si se creó con el comando por defecto)
- pgAdmin: admin@local / admin

## Desarrollo

### Backend
- Las migraciones se ejecutan automáticamente en el entrypoint del contenedor
- Para crear nuevas migraciones, ejecuta:
  ```powershell
  docker-compose exec backend python manage.py makemigrations
  docker-compose exec backend python manage.py migrate
  ```

### Frontend
- El frontend se basa en Vite para el desarrollo
- Los estilos se manejan con Bootstrap para la versión web