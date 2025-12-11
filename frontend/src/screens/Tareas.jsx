import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Linking } from 'react-native';
import axios from '../services/api';
import BackButton from '../components/BackButton.jsx';

export default function Tareas({ navigation, route }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const aulaIdParam = (route && route.params && route.params.aulaId) || null;

  useEffect(() => {
    fetchTareas();
  }, []);

  async function fetchTareas() {
    try {
      const res = await axios.get('/tareas/');
      let data = res.data || [];
      // If opened from an Aula, filter tasks by local mapping stored in localStorage
      if (aulaIdParam && typeof window !== 'undefined') {
        const mapRaw = localStorage.getItem('tareas_aula_v1');
        const map = mapRaw ? JSON.parse(mapRaw) : {};
        data = data.filter((t) => String(map[String(t.id)]) === String(aulaIdParam));
      }
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (typeof document !== 'undefined') {
    return (
      <div className="min-vh-100" style={{ background: 'var(--bg-dark)', paddingTop: '80px' }}>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="display-5 fw-bold text-gradient">Tareas</h2>
            <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.goBack()}>← Regresar</button>
          </div>

          {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) === 'teacher' && (
            <div className="glass-card p-4 mb-4 border-start border-4 border-primary">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-white mb-1">Panel Docente</h5>
                  <p className="text-secondary mb-0 small">Gestione las actividades de aprendizaje para los estudiantes.</p>
                </div>
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => navigation.navigate('CreateTarea', {
                    aulaId: aulaIdParam,
                    aulaTitle: (route && route.params && route.params.aulaTitle) || null
                  })}
                >
                  + Crear Nueva Tarea
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center text-white">Cargando...</div>
          ) : (
            <div className="row g-4">
              {items.map((item) => (
                <div className="col-md-6" key={item.id}>
                  <div className="glass-card h-100 p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-white">{item.title}</h5>
                      <span className="badge bg-secondary bg-opacity-25 text-light">Asignada</span>
                    </div>
                    <p className="text-secondary mb-4 flex-grow-1">{item.instructions}</p>

                    <div className="d-flex gap-2 mt-auto">
                      {item.attached_file && (
                        <a
                          className="btn btn-sm btn-outline-light rounded-pill"
                          href={item.attached_file.startsWith('http') ? item.attached_file : `${window.location.origin}/api/download/?path=${item.attached_file.replace(/^\/?media\//, '')}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📎 Archivo
                        </a>
                      )}

                      {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) !== 'teacher' && (
                        item.is_submitted ? (
                          <button className="btn btn-sm btn-secondary rounded-pill px-3" disabled>
                            ✅ Enviada
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-success rounded-pill px-3" onClick={() => navigation.navigate('SubmitTarea', { id: item.id })}>
                            Entregar Tarea
                          </button>
                        )
                      )}

                      {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) === 'teacher' && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-info rounded-pill px-3 text-white"
                            onClick={() => navigation.navigate('TaskSubmissions', { tareaId: item.id, tareaTitle: item.title })}
                          >
                            👁️ Ver Entregas
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={async () => {
                              if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
                                try {
                                  await axios.delete(`/tareas/${item.id}/`);
                                  fetchTareas();
                                } catch (e) {
                                  console.error(e);
                                  alert('Error al eliminar');
                                }
                              }
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-12">
                  <div className="glass-card p-5 text-center text-muted">
                    No hay tareas asignadas.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Tareas</Text>
      {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) === 'teacher' && (
        <Button title="Crear tarea" onPress={() => navigation.navigate('CreateTarea')} />
      )}
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text>{item.instructions}</Text>
              {item.attached_file && (
                <Text
                  style={styles.fileLink}
                  onPress={() => {
                    const url = item.attached_file.startsWith('http') ? item.attached_file : (typeof window !== 'undefined' ? `${window.location.origin}${item.attached_file}` : item.attached_file);
                    Linking.openURL(url);
                  }}
                >
                  Descargar archivo
                </Text>
              )}
              <Button title="Entregar" onPress={() => navigation.navigate('SubmitTarea', { id: item.id })} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  card: { padding: 12, marginBottom: 8, backgroundColor: '#fff', borderRadius: 6 },
  cardTitle: { fontWeight: '700' },
  fileLink: { color: '#1e90ff', marginTop: 8 },
});
