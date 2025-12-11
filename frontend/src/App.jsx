import React, { useState } from 'react';
// Import Bootstrap CSS for web styling
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
import Landing from './screens/Landing.jsx';
import Login from './screens/Login.jsx';
import Register from './screens/Register.jsx';
import Normativas from './screens/Normativas.jsx';
import CreateNormativa from './screens/CreateNormativa.jsx';
import Tareas from './screens/Tareas.jsx';
import CreateTarea from './screens/CreateTarea.jsx';
import SubmitTarea from './screens/SubmitTarea.jsx';
import About from './screens/About.jsx';
import Aula from './screens/Aula.jsx';
import Footer from './components/Footer.jsx';

import Calificaciones from './screens/Calificaciones.jsx';
import Participantes from './screens/Participantes.jsx';
import TaskSubmissions from './screens/TaskSubmissions.jsx';

// Minimal in-memory router to use on web (avoids react-navigation dependency)
const ROUTES = {
  Landing,
  Login,
  Register,
  About,
  Aula,
  Normativas,
  CreateNormativa,
  Tareas,
  CreateTarea,
  SubmitTarea,
  Calificaciones,
  Participantes,
  TaskSubmissions,
};

export default function App() {
  const [stack, setStack] = useState([{ name: 'Landing', params: {} }]);

  const navigate = (name, params = {}) => setStack((s) => [...s, { name, params }]);
  const goBack = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  // Auto-update role on app load
  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      import('./services/api').then((module) => {
        const api = module.default;
        api.get('/auth/profile/')
          .then(res => {
            if (res.data.role) {
              const currentRole = localStorage.getItem('role');
              if (currentRole !== res.data.role) {
                localStorage.setItem('role', res.data.role);
                // Force re-render if role changed
                setStack(s => [...s]);
              }
            }
          })
          .catch(err => console.warn('Failed to sync role', err));
      });
    }
  }, []);

  const current = stack[stack.length - 1];
  const Screen = ROUTES[current.name] || (() => <div>Ruta no encontrada: {current.name}</div>);

  // Provide a navigation prop compatible with react-navigation usage in screen components
  const navigation = { navigate, goBack };

  if (typeof document !== 'undefined') {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
          <div className="container">
            <a className="navbar-brand fw-bold d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); navigate('Landing'); }}>
              <img src="/logo.png" alt="Logo" height="30" className="me-2" />
              <span><span style={{ color: '#60a5fa' }}>Golden</span> Gazelle</span>
            </a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('About'); }}>Acerca de</a>
                </li>
                {(typeof window !== 'undefined' && localStorage.getItem('username')) && (
                  <>
                    <li className="nav-item ms-3">
                      <span className="text-light me-3">
                        Hola, <span className="fw-bold text-primary">{localStorage.getItem('username')}</span>
                      </span>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('role');
                          localStorage.removeItem('username');
                          window.location.reload();
                        }}
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        <Screen navigation={navigation} route={{ params: current.params }} />
      </>
    );
  }

  return <Screen navigation={navigation} route={{ params: current.params }} />;
}
