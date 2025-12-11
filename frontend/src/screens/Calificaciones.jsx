import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from '../services/api';

export default function Calificaciones({ navigation }) {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await axios.get('/my-grades/');
                setGrades(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    // Group by Unit
    const grouped = { 1: [], 2: [], 3: [], 4: [] };
    grades.forEach(g => {
        const u = g.unit || 1; // Default to 1 if missing
        if (!grouped[u]) grouped[u] = [];
        grouped[u].push(g);
    });

    if (typeof document !== 'undefined') {
        return (
            <div className="min-vh-100" style={{ background: 'var(--bg-dark)', paddingTop: '80px' }}>
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="display-5 fw-bold text-gradient">Calificaciones</h2>
                        <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.goBack()}>← Regresar</button>
                    </div>

                    {loading ? (
                        <div className="text-white text-center">Cargando...</div>
                    ) : (
                        Object.keys(grouped).map(unitId => {
                            const unitGrades = grouped[unitId];
                            if (unitGrades.length === 0) return null;

                            return (
                                <div className="mb-5 animate__animated animate__fadeIn" key={unitId}>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="badge bg-primary rounded-circle p-3 me-3 fs-4">{unitId}</div>
                                        <h3 className="fw-bold text-white mb-0">Unidad {unitId}</h3>
                                    </div>
                                    <div className="glass-card p-4">
                                        <div className="table-responsive">
                                            <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className="text-secondary text-uppercase small">Actividad</th>
                                                        <th scope="col" className="text-secondary text-uppercase small">Calificación</th>
                                                        <th scope="col" className="text-secondary text-uppercase small">Retroalimentación</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {unitGrades.map((g) => (
                                                        <tr key={g.id}>
                                                            <td className="fw-bold text-white">{g.tarea_title}</td>
                                                            <td>
                                                                {g.grade ? (
                                                                    <span className={`badge rounded-pill ${parseFloat(g.grade) >= 7 ? 'bg-success' : 'bg-warning'}`}>
                                                                        {g.grade}/10
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-secondary rounded-pill">Sin calificar</span>
                                                                )}
                                                            </td>
                                                            <td className="text-secondary small">{g.feedback || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {!loading && grades.length === 0 && (
                        <div className="glass-card p-5 text-center text-muted">No tienes calificaciones registradas aún.</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calificaciones</Text>
            <FlatList
                data={grades}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.tarea_title}</Text>
                        <Text>Nota: {item.grade}</Text>
                        <Text>Feedback: {item.feedback}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    card: { padding: 12, marginBottom: 8, backgroundColor: '#fff', borderRadius: 6 },
    cardTitle: { fontWeight: '700' },
});
