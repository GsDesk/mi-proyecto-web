import React from 'react';

export default function BackButton({ navigation, label = 'Volver' }) {
  return (
    <button className="btn btn-link p-0 mb-3" onClick={() => navigation.goBack()}>{label}</button>
  );
}
