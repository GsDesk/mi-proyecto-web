import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import showToast from '../utils/toast';
import BackButton from '../components/BackButton.jsx';
import axios from '../services/api';

export default function CreateTarea({ navigation, route }) {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const aulaId = (route && route.params && route.params.aulaId) || null;
  const aulaTitle = (route && route.params && route.params.aulaTitle) || null;

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      let input = document.getElementById('tarea-file-input');
      if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'tarea-file-input';
        input.style.display = 'none';
        input.onchange = (ev) => {
          const f = ev.target.files[0];
          setFile(f);
        };
        document.body.appendChild(input);
      }
    }
  }, []);

  const triggerFile = () => {
    const input = document.getElementById('tarea-file-input');
    if (input) input.click();
  };

  async function handleSubmit() {
    // Ensure user is logged in and is a teacher
    const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
    const roleNow = (typeof window !== 'undefined' && localStorage.getItem('role')) || null;
    if (!token) {
      showToast('Error', 'Debes iniciar sesión para crear tareas', 'error');
      navigation.navigate('Login');
      return;
    }
    if (roleNow !== 'teacher') {
      showToast('Error', 'Solo usuarios con rol docente pueden crear tareas', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('instructions', instructions);
      if (file) formData.append('attached_file', file);

      const res = await axios.post('/tareas/', formData);
      // Persist mapping tareaId -> aulaId in localStorage so Aula can filter tareas localmente for demo
      try {
        const tareaId = res?.data?.id;
        if (tareaId && aulaId && typeof window !== 'undefined') {
          const mapRaw = localStorage.getItem('tareas_aula_v1');
          const map = mapRaw ? JSON.parse(mapRaw) : {};
          map[tareaId] = aulaId;
          localStorage.setItem('tareas_aula_v1', JSON.stringify(map));
        }
      } catch (e) {
        console.warn('No se pudo persistir mapping tarea->aula', e);
      }
      showToast('OK', 'Tarea creada', 'success');
      navigation.navigate('Tareas', { refreshed: true });
    } catch (err) {
      console.error(err);
      let msg = 'No se pudo crear la tarea';
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data.detail) {
          msg = err.response.data.detail;
        } else {
          // Flatten object values into a string
          msg = Object.values(err.response.data).flat().join('. ');
        }
      } else if (err.message) {
        msg = err.message;
      }
      showToast('Error', msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  if (typeof document !== 'undefined') {
    return (
      <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--bg-dark)', paddingTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="glass-card p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-white mb-0">Crear Tarea</h3>
                  <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => navigation.goBack()}>✕ Cancelar</button>
                </div>
                {aulaTitle && <p className="text-primary small mb-3">Para: {aulaTitle}</p>}

                <div className="mb-3">
                  <label className="form-label text-secondary small">Título</label>
                  <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Diagrama de Clases" />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small">Instrucciones</label>
                  <textarea className="form-control" rows="4" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Detalla los pasos a seguir..." />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small d-block">Material adjunto</label>
                  <button
                    className={`btn w-100 ${file ? 'btn-success' : 'btn-outline-secondary'} border-dashed text-truncate`}
                    onClick={triggerFile}
                    style={{ borderStyle: 'dashed', overflow: 'hidden' }}
                    title={file ? file.name : ''}
                  >
                    {file ? `📄 ${file.name}` : '📎 Adjuntar guía o recurso'}
                  </button>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary btn-lg rounded-pill" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar Tarea'}
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
      <Text style={styles.title}>Crear tarea</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Título" style={styles.input} />
      <TextInput value={instructions} onChangeText={setInstructions} placeholder="Instrucciones" style={styles.input} />
      <Button title={file ? `Archivo: ${file.name}` : 'Adjuntar archivo'} onPress={triggerFile} />
      <View style={{ height: 12 }} />
      <Button title={loading ? 'Creando...' : 'Crear'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 12, borderRadius: 6 },
});
