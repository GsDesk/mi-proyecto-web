import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import showToast from '../utils/toast';
import BackButton from '../components/BackButton.jsx';
import axios from '../services/api';

export default function CreateNormativa({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Note: in web we need an <input type="file"> in plain HTML; react-native-web doesn't include it by default.
  // For quick testing we will provide an example using a file input via vanilla DOM when running on web.

  async function handleSubmit(e) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) formData.append('file', file);

      const res = await axios.post('/normativas/', formData);
      showToast('OK', 'Normativa creada', 'success');
      // navigate back and signal refresh
      navigation.navigate('Normativas', { refreshed: true });
    } catch (err) {
      console.error(err);
      showToast('Error', err?.response?.data || 'No se pudo crear la normativa', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Only for web: mount a hidden file input and capture file
  useEffect(() => {
    if (typeof document !== 'undefined') {
      let input = document.getElementById('normativa-file-input');
      if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'normativa-file-input';
        input.style.display = 'none';
        input.onchange = (ev) => {
          const f = ev.target.files[0];
          setFile(f);
        };
        document.body.appendChild(input);
      }
      return () => { };
    }
  }, []);

  const triggerFile = () => {
    const input = document.getElementById('normativa-file-input');
    if (input) input.click();
  };

  // web-friendly bootstrap form
  if (typeof document !== 'undefined') {
    return (
      <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--bg-dark)', paddingTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="glass-card p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold text-white mb-0">Nueva Normativa</h3>
                  <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => navigation.goBack()}>✕ Cancelar</button>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">Título</label>
                  <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Norma ISO 9001" />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small">Descripción</label>
                  <textarea className="form-control" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción del documento..." />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small d-block">Documento PDF</label>
                  <button
                    className={`btn w-100 ${file ? 'btn-success' : 'btn-outline-secondary'} border-dashed`}
                    onClick={triggerFile}
                    style={{ borderStyle: 'dashed' }}
                  >
                    {file ? `📄 ${file.name}` : '📎 Adjuntar archivo'}
                  </button>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary btn-lg rounded-pill" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Subiendo...' : 'Crear Normativa'}
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
      <Text style={styles.title}>Nueva normativa</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Título" style={styles.input} />
      <TextInput value={description} onChangeText={setDescription} placeholder="Descripción" style={styles.input} />
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
