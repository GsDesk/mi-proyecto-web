import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Linking } from 'react-native';
import axios, { API_BASE } from '../services/api';
import showToast from '../utils/toast';

export default function TaskSubmissions({ navigation, route }) {
    const tareaId = route.params?.tareaId;
    const tareaTitle = route.params?.tareaTitle;
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    async function fetchSubmissions() {
        try {
            setLoading(true);
            const res = await axios.get(`/tareas/${tareaId}/submissions/`);
            // Add local state for editing
            const data = res.data.map(s => ({
                ...s,
                localGrade: s.grade ? String(s.grade) : '',
                localFeedback: s.feedback || '',
                isEditing: false
            }));
            setSubmissions(data);
        } catch (err) {
            console.error(err);
            showToast('Error', 'No se pudieron cargar las entregas', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateGrade(submissionId, index) {
        const sub = submissions[index];
        try {
            await axios.patch(`/submissions/${submissionId}/grade/`, {
                grade: sub.localGrade,
                feedback: sub.localFeedback
            });
            showToast('Éxito', 'Calificación guardada', 'success');
            // Update list to non-editing mode if desired, or keep open
            const next = [...submissions];
            next[index].grade = sub.localGrade;
            next[index].feedback = sub.localFeedback;
            next[index].isEditing = false;
            setSubmissions(next);
        } catch (e) {
            console.error(e);
            showToast('Error', 'No se pudo guardar la calificación', 'error');
        }
    }

    const [previewFile, setPreviewFile] = useState(null);

    const getDownloadUrl = (fileUrl) => {
        if (!fileUrl) return '#';
        let path = fileUrl;
        if (fileUrl.includes('/media/')) {
            path = fileUrl.split('/media/')[1];
        }
        // API_BASE already includes '/api'
        return `${API_BASE}/download/?path=${path}`;
    };

    const getPreviewUrl = (fileUrl) => {
        return `${getDownloadUrl(fileUrl)}&preview=true`;
    };

    if (typeof document !== 'undefined') {
        return (
            <div className="min-vh-100" style={{ background: 'var(--bg-dark)', paddingTop: '80px' }}>
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="text-secondary small text-uppercase mb-1">Evaluación de Tarea</h5>
                            <h2 className="display-6 fw-bold text-white">{tareaTitle}</h2>
                        </div>
                        <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.goBack()}>← Regresar</button>
                    </div>

                    {loading ? (
                        <div className="text-center text-white">Cargando entregas...</div>
                    ) : (
                        <div className="row g-4">
                            {submissions.length === 0 && (
                                <div className="col-12">
                                    <div className="glass-card p-5 text-center text-muted">
                                        No hay entregas para esta tarea aún.
                                    </div>
                                </div>
                            )}
                            {submissions.map((sub, idx) => (
                                <div className="col-12" key={sub.id}>
                                    <div className="glass-card p-4">
                                        <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
                                            <div className="flex-grow-1">
                                                <h5 className="fw-bold text-white mb-1">Estudiante: <span className="text-primary">{sub.student}</span></h5>
                                                <p className="text-muted small mb-2">Entregado: {new Date(sub.submitted_at).toLocaleString()}</p>
                                                {sub.file && (
                                                    <div className="mb-3 d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-info rounded-pill text-white"
                                                            onClick={() => setPreviewFile(getPreviewUrl(sub.file))}
                                                        >
                                                            👁️ Visualizar
                                                        </button>
                                                        <a
                                                            href={getDownloadUrl(sub.file)}
                                                            target="_blank"
                                                            className="btn btn-sm btn-outline-light rounded-pill"
                                                            rel="noreferrer"
                                                        >
                                                            ⬇️ Descargar
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-dark bg-opacity-25 p-3 rounded-3" style={{ minWidth: '350px' }}>
                                                <div className="row g-2">
                                                    <div className="col-4">
                                                        <label className="form-label text-secondary small">Nota (0-10)</label>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm bg-dark text-white border-secondary"
                                                            value={sub.localGrade}
                                                            onChange={(e) => {
                                                                const next = [...submissions];
                                                                next[idx].localGrade = e.target.value;
                                                                next[idx].isEditing = true;
                                                                setSubmissions(next);
                                                            }}
                                                            step="0.1"
                                                            min="0"
                                                            max="10"
                                                        />
                                                    </div>
                                                    <div className="col-8">
                                                        <label className="form-label text-secondary small">Feedback</label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm bg-dark text-white border-secondary"
                                                            placeholder="Comentario..."
                                                            value={sub.localFeedback}
                                                            onChange={(e) => {
                                                                const next = [...submissions];
                                                                next[idx].localFeedback = e.target.value;
                                                                next[idx].isEditing = true;
                                                                setSubmissions(next);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-12 text-end mt-2">
                                                        <button
                                                            className={`btn btn-sm ${sub.isEditing ? 'btn-success' : 'btn-outline-secondary'} rounded-pill`}
                                                            onClick={() => handleUpdateGrade(sub.id, idx)}
                                                            disabled={!sub.isEditing && !!sub.grade}
                                                        >
                                                            {sub.isEditing ? '💾 Guardar Calificación' : (sub.grade ? '✅ Calificado' : 'Guardar')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Preview Modal */}
                    {previewFile && (
                        <div style={webStyles.modalOverlay}>
                            <div style={webStyles.modalContent}>
                                <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                                    <h5 className="text-dark mb-0">Vista Previa</h5>
                                    <button className="btn btn-danger btn-sm" onClick={() => setPreviewFile(null)}>Cerrar ✕</button>
                                </div>
                                <iframe
                                    src={previewFile}
                                    style={webStyles.iframe}
                                    title="Vista Previa"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Evaluación: {tareaTitle}</Text>
            <FlatList
                data={submissions}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item, index }) => (
                    <View style={styles.card}>
                        <Text style={styles.student}>{item.student}</Text>
                        {item.file && <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(getDownloadUrl(item.file))}>Descargar Archivo</Text>}
                        <TextInput
                            placeholder="Nota"
                            value={item.localGrade}
                            onChangeText={(t) => {
                                const next = [...submissions];
                                next[index].localGrade = t;
                                setSubmissions(next);
                            }}
                            style={{ borderWidth: 1, padding: 4, marginVertical: 4 }}
                        />
                        <TextInput
                            placeholder="Feedback"
                            value={item.localFeedback}
                            onChangeText={(t) => {
                                const next = [...submissions];
                                next[index].localFeedback = t;
                                setSubmissions(next);
                            }}
                            style={{ borderWidth: 1, padding: 4, marginVertical: 4 }}
                        />
                        <Button title="Guardar" onPress={() => handleUpdateGrade(item.id, index)} />
                    </View>
                )}
            />
        </View>
    );
}

const webStyles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    modalContent: {
        backgroundColor: 'white',
        width: '90%',
        height: '90%',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column'
    },
    iframe: {
        width: '100%',
        flex: 1,
        border: 'none',
        borderRadius: '4px'
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    card: { padding: 12, marginBottom: 8, backgroundColor: '#fff', borderRadius: 6 },
    student: { fontWeight: '700' },
});
