import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { getAccessToken, removeAccessToken, getUserLogged } from './utils/network-data';
import { useLocale } from './context/LocaleContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { AddNotePage } from './pages/AddNotePage';
import { ArchivedPage } from './pages/ArchivedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingBar } from './components/LoadingBar';
import { LocaleSwitch } from './components/LocaleSwitch';
import { ThemeToggle } from './components/ThemeToggle';
import { LogoutIcon } from './components/Icons';

function App() {
  const [authedUser, setAuthedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (token) {
        const { error, data } = await getUserLogged();
        if (!error) {
          setAuthedUser(data);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    const { error, data } = await getUserLogged();
    if (!error) {
      setAuthedUser(data);
    }
  };

  const handleLogout = () => {
    removeAccessToken();
    setAuthedUser(null);
  };

  if (loading) {
    return (
      <div className="app-container">
        <LoadingBar />
        <main>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-header__title">{t('appTitle')}</h1>
          {authedUser && (
            <>
              <nav className="navigation">
                <ul>
                  <li><NavLink to="/" end>{t('active')}</NavLink></li>
                  <li><NavLink to="/archived">{t('archived')}</NavLink></li>
                </ul>
              </nav>
              <div className="app-header__actions">
                <LocaleSwitch />
                <ThemeToggle />
                <span className="user-chip" title={authedUser.name}>
                  <span className="user-chip__avatar" aria-hidden="true">
                    {(authedUser.name || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="user-chip__name">{authedUser.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="icon-button icon-button--logout"
                  title={t('logout')}
                  aria-label={t('logout')}
                >
                  <LogoutIcon size={20} />
                </button>
              </div>
            </>
          )}
        </header>

        <Routes>
          {!authedUser ? (
            <>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/notes/:id" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />
              <Route path="/notes/new" element={<ProtectedRoute><AddNotePage /></ProtectedRoute>} />
              <Route path="/archived" element={<ProtectedRoute><ArchivedPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;