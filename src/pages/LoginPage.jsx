import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../utils/network-data';
import { putAccessToken } from '../utils/network-data';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

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
      {loading && <LoadingOverlay message={t('loading')} success={success} />}
      <div className="settings-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', margin: '10px' }}>
        <button onClick={toggleLocale} className="toggle-locale" title="Toggle Language">
          {locale === 'id' ? '🇬🇧 EN' : '🇮🇩 ID'}
        </button>
        <button onClick={toggleTheme} className="toggle-theme" title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <h2>{t('login')}</h2>
      <div className="input-login">
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'var(--error)', marginBottom: '16px' }}>{error}</p>}
          <label>{t('email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <label>{t('password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? t('loading') : t('login')}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          {t('noAccount')} <Link to="/register">{t('registerHere')}</Link>
        </p>
      </div>
    </main>
  );
}