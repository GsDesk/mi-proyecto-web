import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Linking } from 'react-native';
import axios from '../services/api';

export default function Normativas({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNormativas();
  }, []);

  async function fetchNormativas() {
    try {
      const res = await axios.get('/normativas/');
      setItems(res.data);
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
            <h2 className="display-5 fw-bold text-gradient">Normativas</h2>
            <div className="d-flex gap-2">
              {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) === 'teacher' && (
                <button className="btn btn-primary rounded-pill" onClick={() => navigation.navigate('CreateNormativa')}>+ Nueva normativa</button>
              )}
              <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.goBack()}>← Regresar</button>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white">Cargando...</div>
          ) : (
            <div className="row g-4">
              {items.map((item) => (
                <div className="col-md-6" key={item.id}>
                  <div className="glass-card h-100 p-4">
                    <h5 className="fw-bold text-white mb-2">{item.title}</h5>
                    <p className="text-secondary mb-4">{item.description}</p>
                    {item.file && (
                      <a
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        href={item.file.startsWith('http') ? item.file : `${window.location.origin}${item.file}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 Descargar archivo
                      </a>
                    )}
                    {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) === 'teacher' && (
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill ms-2"
                        onClick={async () => {
                          if (window.confirm('¿Estás seguro de eliminar esta normativa?')) {
                            try {
                              await axios.delete(`/normativas/${item.id}/`);
                              fetchNormativas();
                            } catch (e) {
                              console.error(e);
                              alert('Error al eliminar');
                            }
                          }
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-12">
                  <div className="glass-card p-5 text-center text-muted">
                    No hay normativas registradas aún.
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
      <Text style={styles.title}>Normativas</Text>
      {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) === 'teacher' && (
        <Button title="Nueva normativa" onPress={() => navigation.navigate('CreateNormativa')} />
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
              <Text>{item.description}</Text>
              {item.file && (
                <Text
                  style={styles.fileLink}
                  onPress={() => {
                    try {
                      const url = item.file.startsWith('http') ? item.file : (typeof window !== 'undefined' ? `${window.location.origin}${item.file}` : item.file);
                      Linking.openURL(url);
                    } catch (e) {
                      console.warn('Cannot open file URL', e);
                    }
                  }}
                >
                  Descargar archivo
                </Text>
              )}
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
