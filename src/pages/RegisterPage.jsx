import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../utils/network-data';
import { LoadingOverlay } from '../components/LoadingOverlay';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const { error } = await registerAPI({ name, email, password });
      if (!error) {
        // Show success animation
        setSuccess(true);
        setTimeout(() => {
          alert('Registrasi berhasil! Silakan login.');
          navigate('/login');
        }, 800);
      } else {
        setError(error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Registrasi gagal');
      setLoading(false);
    }
  };

  return (
    <main>
      {loading && <LoadingOverlay message="Sedang mendaftar..." success={success} />}
      <h2>Register</h2>
      <div className="input-register">
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>}
          <label>Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <label>Konfirmasi Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </main>
  );
}