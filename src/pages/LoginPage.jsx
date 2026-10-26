import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../utils/network-data';
import { putAccessToken } from '../utils/network-data';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useLocale } from '../context/LocaleContext';
import { LocaleSwitch } from '../components/LocaleSwitch';
import { ThemeToggle } from '../components/ThemeToggle';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLocale();

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
      <div className="auth-settings">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
      <h2 className="auth-title">{t('login')}</h2>
      <div className="input-login">
        <form onSubmit={handleSubmit}>
          {error && <p className="form-error" role="alert">{error}</p>}
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
        <p className="auth-footer">
          {t('noAccount')} <Link to="/register">{t('registerHere')}</Link>
        </p>
      </div>
    </main>
  );
}