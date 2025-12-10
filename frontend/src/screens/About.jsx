import React from 'react';
import BackButton from '../components/BackButton.jsx';
import { View, Text, StyleSheet } from 'react-native';

export default function About({ navigation }) {
  if (typeof document !== 'undefined') {
    return (
      <div className="min-vh-100" style={{ background: 'var(--bg-dark)', paddingTop: '80px' }}>
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="display-5 fw-bold text-gradient">Acerca de</h2>
            <button className="btn btn-outline-light rounded-pill" onClick={() => navigation.goBack()}>← Regresar</button>
          </div>

          <div className="glass-card p-5">
            <h1 className="fw-bold text-white mb-4">Ingeniería de Software</h1>
            <p className="lead text-secondary mb-5">
              La Ingeniería de Software es la disciplina dedicada al desarrollo organizado, mantenible y escalable de sistemas de software.
            </p>

            <div className="row g-5">
              <div className="col-md-6">
                <h5 className="text-primary fw-bold mb-3">¿Qué hacemos aquí?</h5>
                <p className="text-secondary">
                  En esta plataforma encontrarás normativas, tareas y recursos orientados a la formación práctica en Ingeniería de Software. Está pensada para apoyar cursos, trabajos prácticos y la coordinación entre docentes y estudiantes.
                </p>

                <h5 className="text-primary fw-bold mb-3 mt-4">Temas relevantes</h5>
                <ul className="text-secondary">
                  <li>Modelado y diseño de sistemas (UML, arquitectura en capas, DDD).</li>
                  <li>Procesos de desarrollo (Agile, Scrum, DevOps).</li>
                  <li>Calidad y pruebas (unitarias, integración, E2E).</li>
                  <li>Gestión de la configuración y CI/CD.</li>
                  <li>Seguridad y privacidad en el ciclo de vida del software.</li>
                </ul>
              </div>

              <div className="col-md-6">
                <div className="p-4 rounded-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <h5 className="text-white fw-bold mb-3">Buenas prácticas</h5>
                  <p className="text-secondary mb-0">
                    Priorizar la comunicación, pequeñas entregas frecuentes, revisión de código y automatización de pruebas para entregar software confiable. Documenta decisiones arquitectónicas y mantén las dependencias actualizadas.
                  </p>
                </div>

                <div className="mt-4">
                  <h5 className="text-primary fw-bold mb-3">Recursos rápidos</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="https://en.wikipedia.org/wiki/Software_engineering" className="text-decoration-none text-info" target="_blank" rel="noreferrer">↗ Wikipedia - Software engineering</a></li>
                    <li className="mb-2"><a href="https://martinfowler.com/" className="text-decoration-none text-info" target="_blank" rel="noreferrer">↗ Martin Fowler - Artículos y patrones</a></li>
                    <li><a href="https://www.oreilly.com/" className="text-decoration-none text-info" target="_blank" rel="noreferrer">↗ O'Reilly - Libros y recursos</a></li>
                  </ul>
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
      <Text style={styles.title}>Ingeniería de Software</Text>
      <Text style={styles.paragraph}>La Ingeniería de Software es la disciplina dedicada al desarrollo organizado, mantenible y escalable de sistemas de software.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  paragraph: { fontSize: 16 },
});
