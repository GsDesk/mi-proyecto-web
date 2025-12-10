import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import showToast from '../utils/toast';
import axios from '../services/api';
import BackButton from '../components/BackButton';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await axios.post('/auth/token/', { username, password });
      const token = res.data.access;
      // persist token (for now simple localStorage since web)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
      }
      // fetch profile and store role
      try {
        const p = await axios.get('/auth/profile/');
        if (typeof window !== 'undefined') localStorage.setItem('role', p.data.role || 'student');
      } catch (e) {
        console.warn('No profile', e);
        if (typeof window !== 'undefined') localStorage.setItem('role', 'student');
      }
      showToast('Éxito', 'Has iniciado sesión', 'success');
      // navigate to dashboard or landing
      navigation.navigate('Landing');
    } catch (err) {
      console.error(err);
      showToast('Error', err?.response?.data?.detail || 'Credenciales inválidas', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (typeof document !== 'undefined') {
    return (
      <div className="d-flex align-items-center min-vh-100" style={{ background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              <div className="glass-card p-4 p-md-5">
                <div className="text-center mb-4">
                  <img src="/logo.png" alt="Logo" height="60" className="mb-3" />
                  <h2 className="fw-bold text-gradient">Bienvenido</h2>
                  <p className="text-secondary">Inicia sesión para continuar</p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Usuario</label>
                  <input
                    className="form-control form-control-lg"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small">Contraseña</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-grid gap-2 mb-4">
                  <button
                    className="btn btn-primary btn-lg rounded-pill"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Iniciar Sesión'}
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
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput value={username} onChangeText={setUsername} placeholder="Usuario" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Contraseña" style={styles.input} secureTextEntry />
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      <View style={{ marginTop: 12 }}>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 14, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 12, borderRadius: 6 },
});
