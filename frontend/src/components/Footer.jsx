import React from 'react';

export default function Footer({ navigation }) {
  const username = (typeof window !== 'undefined' && localStorage.getItem('username')) || null;
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.reload();
    }
  };

  return (
    <footer className="fixed-bottom bg-light border-top py-3 footer-custom">
      <div className="container d-flex justify-content-center">
        { !username ? (
          <>
            <button className="btn btn-primary me-2" onClick={() => navigation.navigate('Login')}>Iniciar sesión</button>
            <button className="btn btn-outline-primary me-2" onClick={() => navigation.navigate('Register')}>Registrarse</button>
            <button className="btn btn-success" onClick={() => navigation.navigate('Aula')}>Entrar al Aula</button>
          </>
        ) : (
          <div className="d-flex align-items-center">
            <span className="me-3">Hola, <strong>{username}</strong></span>
            <button className="btn btn-secondary" onClick={logout}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </footer>
  );
}
