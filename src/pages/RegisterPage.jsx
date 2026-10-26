import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../utils/network-data';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useLocale } from '../context/LocaleContext';
import { LocaleSwitch } from '../components/LocaleSwitch';
import { ThemeToggle } from '../components/ThemeToggle';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLocale();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwordMismatch') || 'Password dan konfirmasi password tidak sama');
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort') || 'Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const { error } = await registerAPI({ name, email, password });
      if (!error) {
        // Show success animation
        setSuccess(true);
        setTimeout(() => {
          alert(t('registerSuccess'));
          navigate('/login');
        }, 800);
      } else {
        setError(error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || t('registerFailed'));
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
      <h2 className="auth-title">{t('register')}</h2>
      <div className="input-register">
        <form onSubmit={handleSubmit}>
          {error && <p className="form-error" role="alert">{error}</p>}
          <label>{t('name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
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
          <label>{t('confirmPassword')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? t('loading') : t('register')}
          </button>
        </form>
        <p className="auth-footer">
          {t('haveAccount')} <Link to="/login">{t('loginHere')}</Link>
        </p>
      </div>
    </main>
  );
}