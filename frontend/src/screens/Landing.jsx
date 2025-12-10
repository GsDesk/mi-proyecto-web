import React from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, TouchableOpacity } from 'react-native';

export default function Landing({ navigation }) {
  const role = (typeof window !== 'undefined' && localStorage.getItem('role')) || null;
  const username = (typeof window !== 'undefined' && localStorage.getItem('username')) || null;

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.reload();
    }
  };

  if (typeof document !== 'undefined') {
    // Web layout with premium design
    return (
      <div className="landing-page" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Hero Section */}
        <div className="container py-5">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="badge bg-primary bg-opacity-25 text-primary mb-3 px-3 py-2 rounded-pill border border-primary border-opacity-25">
                Plataforma Académica v2.0
              </div>
              <h1 className="display-3 fw-bold mb-4" style={{
                background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Ingeniería de Software
              </h1>
              <p className="lead mb-5 text-gray-300" style={{ color: '#cbd5e1', fontSize: '1.25rem', lineHeight: '1.8' }}>
                Domina el arte de crear software robusto. Colabora, diseña y entrega proyectos siguiendo las mejores prácticas de la industria en un entorno moderno y seguro.
              </p>

              <div className="d-flex gap-3">
                {!username ? (
                  <>
                    <button
                      className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg"
                      style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)', border: 'none' }}
                      onClick={() => navigation.navigate('Register')}
                    >
                      Comenzar Ahora
                    </button>
                    <button
                      className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold"
                      style={{ borderWidth: '2px' }}
                      onClick={() => navigation.navigate('Login')}
                    >
                      Iniciar Sesión
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg"
                    onClick={() => navigation.navigate('Aula')}
                  >
                    Ir al Aula Virtual
                  </button>
                )}
              </div>
            </div>

            <div className="col-lg-6 position-relative">
              <div className="position-absolute top-50 start-50 translate-middle w-75 h-75 bg-primary rounded-circle"
                style={{ filter: 'blur(100px)', opacity: '0.2', zIndex: 0 }}></div>
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
                alt="Coding Interface"
                className="img-fluid rounded-4 shadow-lg position-relative"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)'}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container py-5">
          <div className="row g-4">
            {[
              {
                title: 'Normativas Claras',
                desc: 'Accede a documentación estandarizada y guías de estilo actualizadas.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )
              },
              {
                title: 'Gestión de Tareas',
                desc: 'Sube y revisa entregas con un flujo de trabajo optimizado.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                )
              },
              {
                title: 'Feedback Continuo',
                desc: 'Recibe retroalimentación detallada de tus docentes en tiempo real.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                )
              }
            ].map((feature, idx) => (
              <div key={idx} className="col-md-4">
                <div className="p-4 rounded-4 h-100" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <h3 className="h4 fw-bold mb-3">{feature.title}</h3>
                  <p className="text-secondary" style={{ color: '#94a3b8' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Normativas Section */}
        <div className="container py-5">
          <div className="glass-card p-5">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="display-5 fw-bold mb-4 text-gradient">Normativas de Ingeniería de Software</h2>
                <p className="text-secondary mb-4">
                  Las normativas son fundamentales para garantizar la calidad, seguridad y mantenibilidad del software. En esta plataforma nos basamos en estándares internacionales como:
                </p>
                <ul className="list-unstyled text-secondary">
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-primary rounded-pill me-3">ISO/IEC 12207</span>
                    Ciclo de vida del software
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-primary rounded-pill me-3">ISO/IEC 25010</span>
                    Modelos de calidad del producto
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <span className="badge bg-primary rounded-pill me-3">IEEE 829</span>
                    Documentación de pruebas de software
                  </li>
                </ul>
              </div>
              <div className="col-lg-6 mt-4 mt-lg-0">
                <div className="p-4 rounded-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <h4 className="text-white mb-3">¿Por qué son importantes?</h4>
                  <div className="d-flex gap-3 mb-3">
                    <div className="h2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="text-white">Seguridad</h6>
                      <p className="small text-secondary mb-0">Reducen vulnerabilidades y riesgos en el desarrollo.</p>
                    </div>
                  </div>
                  <div className="d-flex gap-3 mb-3">
                    <div className="h2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="text-white">Eficiencia</h6>
                      <p className="small text-secondary mb-0">Optimizan procesos y recursos del equipo.</p>
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <div className="h2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="text-white">Interoperabilidad</h6>
                      <p className="small text-secondary mb-0">Facilitan la integración entre diferentes sistemas.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Mobile Layout (React Native Web fallback)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingeniería de Software</Text>
      <Text style={styles.subtitle}>Plataforma Académica</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>
          Bienvenido a la plataforma móvil. Accede a tus cursos y tareas desde cualquier lugar.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!username ? (
          <>
            <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} color="#4f46e5" />
            <View style={{ height: 10 }} />
            <Button title="Registrarse" onPress={() => navigation.navigate('Register')} color="#2563eb" />
          </>
        ) : (
          <Button title="Ir al Aula" onPress={() => navigation.navigate('Aula')} color="#10b981" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#94a3b8', textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 15, marginBottom: 30 },
  cardText: { color: '#e2e8f0', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  buttonContainer: { gap: 10 }
});
