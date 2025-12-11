import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

// Simple Aula Virtual screen: stores data in localStorage for demo purposes
export default function Aula({ navigation }) {
  const isWeb = typeof document !== 'undefined';
  const [aulas, setAulas] = useState([]);
  const [title, setTitle] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (isWeb) {
      const raw = localStorage.getItem('aulas_v1');
      setAulas(raw ? JSON.parse(raw) : []);
    }
  }, []);

  const saveAulas = (next) => {
    setAulas(next);
    if (isWeb) localStorage.setItem('aulas_v1', JSON.stringify(next));
  };

  const createAula = () => {
    if (!title) return;
    const newAula = { id: Date.now(), title, announcements: [], resources: [] };
    saveAulas([newAula, ...aulas]);
    setTitle('');
  };

  const postAnnouncement = (aulaId) => {
    if (!announcement) return;
    const next = aulas.map((a) => {
      if (a.id === aulaId) return { ...a, announcements: [{ id: Date.now(), text: announcement }, ...a.announcements] };
      return a;
    });
    saveAulas(next);
    setAnnouncement('');
  };

  if (isWeb) {
    const [currentUnit, setCurrentUnit] = useState(1);
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : 'Estudiante';
    const userInitials = username ? username.substring(0, 2).toUpperCase() : 'US';

    const units = [
      {
        id: 1, title: 'Unidad 1: Aplicación de metodología de desarrollo de software', topics: [
          { title: 'TEMA 1.1. Desarrollo de software', desc: 'Historia del desarrollo de software. Metodologías de desarrollo de software. Principios y finalidades.' },
          { title: 'TEMA 1.2. Metodologías pesadas RUP', desc: '' },
          { title: 'TEMA 1.3. Metodologías ligeras', desc: 'XP, SCRUM, CRYSTAL, Agile Inception, KANBAN, DSDM, ASD, SDD, LD.' },
          { title: 'TEMA 1.4. Enfoques de desarrollo de software', desc: 'Cascada, Prototipado, Incremental, Espiral, RAD.' },
          { title: 'TEMA 1.5. Paradigmas de programación', desc: 'Programación estructurada, Programación dirigida por eventos, Programación modular.' },
          { title: 'TEMA 1.6. Paradigmas de programación (cont.)', desc: 'Programación orientada a aspectos, Programación orientada a objetos, Programación orientada a componentes.' }
        ]
      },
      {
        id: 2, title: 'Unidad 2: Normativas y Estándares', topics: [
          { title: 'TEMA 2.1. Introducción a las Normativas', desc: 'Importancia de los estándares en la ingeniería de software.' },
          { title: 'TEMA 2.2. ISO/IEC 12207', desc: 'Procesos del ciclo de vida del software.' },
          { title: 'TEMA 2.3. ISO/IEC 29110', desc: 'Perfiles de ciclo de vida para VSE (Pequeñas Entidades).' }
        ]
      },
      {
        id: 3, title: 'Unidad 3: Calidad de Software', topics: [
          { title: 'TEMA 3.1. Modelos de Calidad', desc: 'McCall, Boehm, ISO 9126, ISO 25000.' },
          { title: 'TEMA 3.2. Aseguramiento de la Calidad (SQA)', desc: 'Planes, revisiones y auditorías.' }
        ]
      },
      {
        id: 4, title: 'Unidad 4: Gestión de Proyectos', topics: [
          { title: 'TEMA 4.1. Planificación y Estimación', desc: 'Técnicas de estimación, cronogramas y asignación de recursos.' },
          { title: 'TEMA 4.2. Gestión de Riesgos', desc: 'Identificación, análisis y mitigación de riesgos.' }
        ]
      }
    ];

    const activeUnitData = units.find(u => u.id === currentUnit);

    return (
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', paddingTop: '80px' }}>
        {/* Course Header */}
        <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
          <div
            className="position-absolute w-100 h-100"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              opacity: 0.9
            }}
          ></div>
          <div className="container position-relative h-100 d-flex flex-column justify-content-end pb-4">
            <button className="btn btn-sm btn-outline-light rounded-pill mb-auto mt-4 align-self-start" onClick={() => navigation.goBack()}>← Regresar</button>
            <div className="badge bg-primary text-white mb-2 align-self-start">Periodo Académico 2025</div>
            <h1 className="display-5 fw-bold text-white">NORMATIVAS DE INGENIERÍA DE SOFTWARE</h1>
            <div className="d-flex align-items-center mt-2">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold me-2" style={{ width: 40, height: 40 }}>{userInitials}</div>
              <span className="text-white text-uppercase">{username}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-50 sticky-top" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="container">
            <ul className="nav nav-pills py-2">
              <li className="nav-item"><a className="nav-link active bg-primary text-white rounded-pill" href="#" onClick={(e) => e.preventDefault()}>Curso</a></li>
              <li className="nav-item"><a className="nav-link text-secondary" href="#" onClick={(e) => { e.preventDefault(); navigation.navigate('Participantes'); }}>Participantes</a></li>
  const handleDownloadReport = async () => {
    if (typeof window === 'undefined') return;
              try {
                showToast('Generando informe...', 'Por favor espera', 'info');
              // Import dynamically to avoid top-level require issues or use global axios if imported
              const { default: api } = await import('../services/api');
              const response = await api.get('/student/report/', {responseType: 'blob' });

              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `Informe_Actividades_${username}.pdf`);
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
              showToast('Éxito', 'Informe descargado correctamente', 'success');
    } catch (error) {
                console.error(error);
              showToast('Error', 'No se pudo generar el informe', 'error');
    }
  };

              if (isWeb) {
    // ... code truncated ...

    // In the return JSX, inside the nav-pills list
// ...
              <li className="nav-item"><a className="nav-link text-secondary" href="#" onClick={(e) => { e.preventDefault(); navigation.navigate('Calificaciones'); }}>Calificaciones</a></li>
              <li className="nav-item">
                <a className="nav-link text-secondary" href="#" onClick={(e) => { e.preventDefault(); handleDownloadReport(); }}>
                  📥 Descargar Informe
                </a>
              </li>
              {/* Competencias removed as requested */}
            </ul>
          </div>
        </div>

        <div className="container py-5">
          {/* Active Unit Section */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-white">{activeUnitData.title}</h3>
              {currentUnit < 4 && (
                <button
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={() => setCurrentUnit(currentUnit + 1)}
                >
                  Unidad {currentUnit + 1} →
                </button>
              )}
            </div>

            {/* Unit Banner */}
            <div className="rounded-4 p-5 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)' }}>
              <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                <div className="col-md-8">
                  <div className="display-1 fw-bold text-white opacity-25" style={{ letterSpacing: '-5px' }}>Unidad {currentUnit}</div>
                </div>
              </div>
            </div>

            {/* Unit Content (Topics) */}
            <div className="glass-card p-4">
              <h5 className="text-primary fw-bold text-uppercase mb-4">Temas de la Unidad {currentUnit}</h5>
              <ul className="list-unstyled text-secondary">
                {activeUnitData.topics.map((topic, idx) => (
                  <li className="mb-3" key={idx}>
                    <strong className="text-white d-block mb-1">{topic.title}</strong>
                    {topic.desc}
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-top border-secondary border-opacity-25">
                <h6 className="text-white fw-bold mb-3">Actividades de Aprendizaje</h6>
                <div className="d-flex gap-3 flex-wrap">
                  <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.navigate('Normativas')}>
                    📂 Recursos y Normativas
                  </button>
                  <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.navigate('Tareas', { aulaId: 'normativas-101', aulaTitle: 'Normativas de Ingeniería' })}>
                    📝 Tareas y Entregas
                  </button>
                  {((typeof window !== 'undefined' && localStorage.getItem('role')) || null) === 'teacher' && (
                    <button className="btn btn-primary rounded-pill" onClick={() => navigation.navigate('CreateTarea', { aulaId: 'normativas-101', aulaTitle: 'Normativas de Ingeniería' })}>
                      + Crear Actividad
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Other Units List */}
          {units.filter(u => u.id !== currentUnit).map((u) => (
            <div
              key={u.id}
              className="glass-card p-4 mb-4 opacity-75"
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setCurrentUnit(u.id)}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.75'}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="text-white mb-0">{u.title.split(':')[0]}</h4>
                <span className="text-primary small">Ver contenido →</span>
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  }

  // Mobile/simple rendering
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Aula virtual</Text>
      <Text style={{ marginBottom: 8, color: '#666' }}>Crea aulas y publica anuncios (demo local).</Text>

      <TextInput placeholder="Nombre del aula" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Button title="Crear aula" onPress={createAula} />

      <FlatList
        data={aulas}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, marginTop: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.title}</Text>
            <Text>Announcements: {item.announcements ? item.announcements.length : 0}</Text>
            <Button title="Ver tareas" onPress={() => navigation.navigate('Tareas', { aulaId: item.id, aulaTitle: item.title })} />
          </View>
        )}
      />
    </View>
  );
}
