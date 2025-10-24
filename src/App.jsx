import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { getAccessToken, removeAccessToken, getUserLogged } from './utils/network-data';
import { useTheme } from './context/ThemeContext';
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

function App() {
  const [authedUser, setAuthedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

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
        <header>
          <h1>{t('appTitle')}</h1>
          {authedUser && (
            <>
              <nav className="navigation">
                <ul>
                  <li><Link to="/">{t('active')}</Link></li>
                  <li><Link to="/archived">{t('archived')}</Link></li>
                </ul>
              </nav>
              <button onClick={toggleLocale} className="toggle-locale" title="Toggle Language">
                {locale === 'id' ? '🇬🇧 EN' : '🇮🇩 ID'}
              </button>
              <button onClick={toggleTheme} className="toggle-theme" title="Toggle Theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className="button-logout">
                <span>{authedUser.name}</span>
                <span>🚪</span>
              </button>
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