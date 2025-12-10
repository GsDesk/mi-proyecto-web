import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import showToast from '../utils/toast';
import axios from '../services/api';
import BackButton from '../components/BackButton.jsx';

export default function SubmitTarea({ route, navigation }) {
  const { id } = route.params || {};
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      let input = document.getElementById('submit-file-input');
      if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'submit-file-input';
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
    const input = document.getElementById('submit-file-input');
    if (input) input.click();
  };

  async function handleSubmit() {
    if (!file) return showToast('Error', 'Selecciona un archivo', 'error');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      await axios.post(`/tareas/${id}/submit/`, fd);
      showToast('OK', 'Entrega enviada', 'success');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      let msg = 'No se pudo enviar la entrega';
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (err.response.data.detail) {
          msg = err.response.data.detail;
        } else {
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
            <div className="col-md-6 col-lg-5">
              <div className="glass-card p-4 p-md-5 text-center">
                <div className="mb-4">
                  <div className="h1 mb-3">📤</div>
                  <h3 className="fw-bold text-white">Entregar Tarea</h3>
                  <p className="text-secondary">Sube tu archivo para completar la entrega.</p>
                </div>

                <div className="mb-4">
                  <button
                    className={`btn w-100 py-4 ${file ? 'btn-success bg-opacity-25 text-success' : 'btn-outline-secondary'} border-dashed`}
                    onClick={triggerFile}
                    style={{ borderStyle: 'dashed', borderWidth: '2px' }}
                  >
                    {file ? (
                      <div>
                        <div className="h3 mb-0">📄</div>
                        <div className="small">{file.name}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="h3 mb-2">📎</div>
                        <div>Seleccionar archivo</div>
                      </div>
                    )}
                  </button>
                </div>

                <div className="d-grid gap-3">
                  <button className="btn btn-primary btn-lg rounded-pill" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Entrega'}
                  </button>
                  <button className="btn btn-link text-secondary text-decoration-none" onClick={() => navigation.goBack()}>
                    Cancelar
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
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Entregar tarea</Text>
      <Button title={file ? `Archivo: ${file.name}` : 'Seleccionar archivo'} onPress={triggerFile} />
      <View style={{ height: 12 }} />
      <Button title={loading ? 'Enviando...' : 'Enviar'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
