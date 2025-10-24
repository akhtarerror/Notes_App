import React from 'react';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main>
      <div className="not-found">
        <h2 className="not-found__title">404</h2>
        <p className="not-found__message">Halaman tidak ditemukan</p>
        <div className="not-found__action">
          <button
            onClick={() => navigate('/')}
            className="action"
            title="Kembali ke Beranda"
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: '12px',
              padding: '50px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </main>
  );
}