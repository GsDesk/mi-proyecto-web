import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from '../services/api';
import BackButton from '../components/BackButton.jsx';

export default function Participantes({ navigation }) {
    const [participants, setParticipants] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchParticipants();
    }, []);

    async function fetchParticipants() {
        try {
            // Assuming axios is configured with base URL and auth headers
            const res = await axios.get('/users/');
            // Map backend data to frontend structure if needed, or use directly
            // Backend returns: { id, username, email, role }
            // We want to map 'username' to 'name', and generate avatar
            const mapped = res.data.map(u => ({
                id: u.id,
                name: u.username, // or u.first_name + ' ' + u.last_name if available
                role: u.role === 'teacher' ? 'Docente' : 'Estudiante',
                email: u.email || `${u.username}@upec.edu.ec`, // Fallback email
                avatar: u.username.substring(0, 2).toUpperCase()
            }));
            setParticipants(mapped);
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
                        <h2 className="display-5 fw-bold text-gradient">Participantes</h2>
                        <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.goBack()}>← Regresar</button>
                    </div>

                    {loading ? (
                        <div className="text-center text-white">Cargando participantes...</div>
                    ) : (
                        <div className="row g-4">
                            {participants.map((p) => (
                                <div className="col-md-6 col-lg-4" key={p.id}>
                                    <div className="glass-card p-4 d-flex align-items-center">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 ${p.role === 'Docente' ? 'bg-primary' : 'bg-secondary'}`} style={{ width: 50, height: 50, fontSize: '1.2rem' }}>
                                            {p.avatar}
                                        </div>
                                        <div>
                                            <h5 className="fw-bold text-white mb-0">{p.name}</h5>
                                            <small className={`text-uppercase fw-bold ${p.role === 'Docente' ? 'text-primary' : 'text-secondary'}`} style={{ fontSize: '0.7rem' }}>{p.role}</small>
                                            <div className="text-muted small">{p.email}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <Text style={styles.title}>Participantes</Text>
            {loading ? (
                <Text>Cargando...</Text>
            ) : (
                <FlatList
                    data={participants}
                    keyExtractor={(i) => String(i.id)}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text>{item.role}</Text>
                            <Text>{item.email}</Text>
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
});
