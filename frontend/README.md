# Frontend (Vite + React + react-native-web)

This frontend is a Vite app using React and react-native-web. It was configured to work for the web and mobile fallback.

## Características

- Desarrollo web con React y Bootstrap
- Compatibilidad con componentes de React Native mediante react-native-web
- Autenticación JWT
- Routing simple para navegación entre pantallas

## Requisitos

- Node.js 16+
- npm o yarn

## Inicio rápido (Windows PowerShell)

1. **Instalar dependencias**
   ```powershell
   cd frontend
   npm install
   ```

2. **Configurar variables de entorno**
   Crear un archivo `.env` en el directorio `frontend` basado en `.env.example`:
   ```powershell
   cp .env.example .env
   ```
   
   Asegúrate de que `VITE_API_BASE_URL` apunta a tu backend (por defecto: http://localhost:8000/api)

3. **Iniciar servidor de desarrollo**
   ```powershell
   npm run dev
   ```
   
   O especificar host y puerto:
   ```powershell
   npx vite --port 5173 --host 127.0.0.1
   ```

4. **Construir para producción**
   ```powershell
   npm run build
   ```

5. **Previsualizar build de producción**
   ```powershell
   npx vite preview --port 5173 --host 127.0.0.1
   ```

## Estructura de directorios

- `src/` - Código fuente principal
  - `components/` - Componentes reutilizables
  - `screens/` - Pantallas de la aplicación
  - `services/` - Servicios API
  - `styles/` - Archivos de estilo
  - `utils/` - Utilidades y helpers

## Desarrollo

### Componentes

Los componentes están diseñados para funcionar tanto en web como en móvil. Usa `typeof document !== 'undefined'` para detectar el entorno web y renderizar contenido específico.

### Estilos

- Web: Bootstrap 5 CSS
- Móvil: StyleSheet de React Native

### Autenticación

El sistema usa JWT tokens almacenados en localStorage. El interceptor de axios añade automáticamente el token a las solicitudes.

## Solución de problemas

- Si ves errores de parseo JSX, asegúrate de que los archivos con JSX usen la extensión `.jsx`.
- Si el servidor de desarrollo muestra "VITE ready" pero el navegador no puede conectar, prueba usar `--host 0.0.0.0` o asegúrate de que ningún firewall bloquee el puerto.
- Si la aplicación falla al obtener datos de la API, confirma que `VITE_API_BASE_URL` apunta al backend en ejecución (por defecto: http://localhost:8000/api).
- Si hay errores de CORS, verifica que el backend tenga configurado `CORS_ALLOW_ALL_ORIGINS = True`.

## Despliegue

Para desplegar en producción:

1. Construye la aplicación:
   ```bash
   npm run build
   ```

2. Sirve los archivos generados en `dist/` usando un servidor web como Nginx, Apache, o cualquier servicio de hosting estático.