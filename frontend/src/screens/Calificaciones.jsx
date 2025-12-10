import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BackButton from '../components/BackButton.jsx';

export default function Calificaciones({ navigation }) {
    // Mock data for grades
    const grades = [
        { id: 1, activity: 'Tarea 1: Ensayo sobre Metodologías', grade: '9.5/10', feedback: 'Excelente trabajo, buena argumentación.' },
        { id: 2, activity: 'Tarea 2: Mapa Conceptual RUP', grade: '8.0/10', feedback: 'Buen diseño, faltaron algunos detalles en la fase de transición.' },
        { id: 3, activity: 'Examen Unidad 1', grade: '10/10', feedback: 'Perfecto.' },
    ];

    if (typeof document !== 'undefined') {
        return (
            <div className="min-vh-100" style={{ background: 'var(--bg-dark)', paddingTop: '80px' }}>
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="display-5 fw-bold text-gradient">Calificaciones</h2>
                        <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.goBack()}>← Regresar</button>
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
                                    {grades.map((g) => (
                                        <tr key={g.id}>
                                            <td className="fw-bold text-white">{g.activity}</td>
                                            <td><span className="badge bg-primary rounded-pill">{g.grade}</span></td>
                                            <td className="text-secondary">{g.feedback}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Calificaciones</Text>
            <FlatList
                data={grades}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.activity}</Text>
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
