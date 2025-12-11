import React, { useState } from 'react';
import { View, TextInput, Button, Text, Picker } from 'react-native';
import api from '../services/api';
import showToast from '../utils/toast';
import BackButton from '../components/BackButton';

export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    // Basic validation
    if (!username || !password) {
      setError('Usuario y contraseña son requeridos');
      showToast('Error', 'Usuario y contraseña son requeridos', 'error');
      return;
    }

    if (role === 'teacher' && !accessCode) {
      setError('El código de docente es obligatorio');
      return;
    }

    try {
      const res = await api.post('/auth/register/', { username, password, role, access_code: accessCode });
      console.log(res.data);
      showToast('Registro', 'Usuario creado con éxito', 'success');
      navigation.navigate('Login');
    } catch (e) {
      console.error('Registration error:', e);
      let msg = 'No se pudo registrar el usuario';

      if (e.response) {
        // Server responded with a status code outside 2xx
        if (e.response.data) {
          if (e.response.data.detail) {
            msg = e.response.data.detail;
          } else if (typeof e.response.data === 'object') {
            // Join all field errors
            const errors = Object.values(e.response.data).flat();
            if (errors.length > 0) msg = errors.join('. ');
            else msg = JSON.stringify(e.response.data);
          } else {
            msg = `Error ${e.response.status}: ${e.response.statusText}`;
          }
        } else {
          msg = `Error ${e.response.status}: ${e.response.statusText}`;
        }
      } else if (e.request) {
        // Request was made but no response received (Network Error)
        msg = 'Error de conexión: No se pudo contactar al servidor. Verifica tu internet o que el backend esté activo.';
      } else {
        msg = e.message;
      }

      setError(msg);
      showToast('Error', msg, 'error');
    }
  };

  if (typeof document !== 'undefined') {
    return (
      <div className="d-flex align-items-center min-vh-100" style={{ background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              <div className="glass-card p-4 p-md-5">
                <div className="text-center mb-4">
                  <img src="/logo.png" alt="Logo" height="60" className="mb-3" />
                  <h2 className="fw-bold text-gradient">Crear Cuenta</h2>
                  <p className="text-secondary">Únete a la plataforma académica</p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Usuario <span className="text-muted" style={{ fontSize: '0.8em' }}>(Sin espacios)</span></label>
                  <input
                    className="form-control form-control-lg"
                    placeholder="Ej: johelpilacuan"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Contraseña</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Crea una contraseña segura"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small">Rol Académico</label>
                  <select
                    className="form-select form-select-lg"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="student">Estudiante</option>
                    <option value="teacher">Docente</option>
                  </select>
                </div>

                {role === 'teacher' && (
                  <div className="mb-4 animate__animated animate__fadeIn">
                    <label className="form-label text-danger small fw-bold">🔒 Código de Acceso Docente</label>
                    <input
                      type="password"
                      className="form-control form-control-lg border-danger"
                      placeholder="Ingresa la clave maestra"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                    />
                    <div className="form-text text-muted small">Solo personal autorizado.</div>
                  </div>
                )}

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <div className="d-grid gap-2 mb-4">
                  <button
                    className="btn btn-primary btn-lg rounded-pill"
                    onClick={handleRegister}
                  >
                    Registrarse
                  </button>
                </div>

                <div className="text-center">
                  <button className="btn btn-link text-secondary text-decoration-none" onClick={() => navigation.goBack()}>
                    ← Volver al inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Registro</Text>
      <TextInput placeholder="Usuario" value={username} onChangeText={setUsername} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <Text style={{ marginBottom: 6 }}>Rol</Text>
      {/* Use a web-friendly select for roles to avoid Picker dependency issues on web */}
      <div style={{ borderWidth: 1, marginBottom: 10 }}>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: 8 }}>
          <option value="student">Estudiante</option>
          <option value="teacher">Docente</option>
        </select>
      </div>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}
