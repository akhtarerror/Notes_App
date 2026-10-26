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
            className="action action--primary"
            title="Kembali ke Beranda"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </main>
  );
}