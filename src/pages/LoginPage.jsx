import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../utils/network-data';
import { putAccessToken } from '../utils/network-data';
import { LoadingOverlay } from '../components/LoadingOverlay';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error, data } = await loginAPI({ email, password });
      if (!error) {
        putAccessToken(data.accessToken);
        
        // Show success animation first
        setSuccess(true);
        
        // Wait for animation, then update auth state and navigate
        setTimeout(async () => {
          await onLogin();
          navigate('/', { replace: true });
        }, 800);
      } else {
        setError(error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Login gagal');
      setLoading(false);
    }
  };

  return (
    <main>
      {loading && <LoadingOverlay message="Sedang login..." success={success} />}
      <h2>Login</h2>
      <div className="input-login">
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>}
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
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </main>
  );
}