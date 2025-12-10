# Normativas - Frontend (web)

Pasos rápidos (PowerShell) para arrancar la UI web y probar registro/login/flows:

1. Ir al directorio frontend

```powershell
cd C:\Users\AleX'x\project\frontend
```

2. Instalar dependencias (si no lo hiciste ya)

```powershell
npm install
# o yarn
```

3. Iniciar la app web (usando Expo o tu runner):

```powershell
npm start
# o
expo start --web
```

4. Probar registro / login

- Registro (PowerShell safe):

```powershell
$body = @{ username = 'alice3'; password = 'testpass'; role = 'teacher' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:8000/api/auth/register/' -ContentType 'application/json' -Body $body
```

- Obtener token:

```powershell
$body = @{ username = 'alice3'; password = 'testpass' } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri 'http://localhost:8000/api/auth/token/' -ContentType 'application/json' -Body $body
$token = $resp.access
```

- Llamar profile (para ver role):

```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:8000/api/auth/profile/' -Headers @{ Authorization = "Bearer $token" }
```

5. Notas

- Los botones de crear tareas/normativas en la UI sólo se muestran si tu usuario tiene rol `teacher` (el frontend lee `role` desde localStorage tras el login).
- El admin Django estará disponible en `http://localhost:8000/admin/` y los docentes pueden usar el botón "Ir al panel admin" cuando su rol sea `teacher`.
- Para pruebas de subida vía curl dentro de un contenedor evite problemas de PowerShell quoting (ejemplo usado en la sesión):

```powershell
# obtener token dentro del contenedor o desde PowerShell, luego
docker run --rm -v "C:\Users\AleX'x\project:/work" --network host curlimages/curl:8.4.0 -H "Authorization: Bearer <TOKEN>" -F title='Prueba' -F description='desc' -F file=@/work/README.md http://localhost:8000/api/normativas/
```
