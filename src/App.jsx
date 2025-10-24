import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { showFormattedDate } from './utils/index';
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  register as registerAPI,
  login as loginAPI,
  getUserLogged,
  addNote as addNoteAPI,
  getActiveNotes as getActiveNotesAPI,
  getArchivedNotes as getArchivedNotesAPI,
  getNote as getNoteAPI,
  archiveNote as archiveNoteAPI,
  unarchiveNote as unarchiveNoteAPI,
  deleteNote as deleteNoteAPI,
} from './utils/network-data';
import { useTheme } from './context/ThemeContext';

// SearchBar Component
function SearchBar({ keyword, onKeywordChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cari catatan..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />
    </div>
  );
}

// NoteItem Component
function NoteItem({ note }) {
  return (
    <div className="note-item" style={{ borderTopColor: note.archived ? '#03DAC6' : '#BB86FC' }}>
      <h3 className="note-item__title">
        <Link to={`/notes/${note.id}`}>{note.title}</Link>
      </h3>
      <p className="note-item__createdAt">{showFormattedDate(note.createdAt)}</p>
      <p className="note-item__body">{note.body}</p>
    </div>
  );
}

// NotesList Component
function NotesList({ notes }) {
  if (notes.length === 0) {
    return (
      <div className="notes-list-empty">
        <p>Tidak ada catatan</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}

// LoginPage Component
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
        await onLogin();
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
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
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

// RegisterPage Component
function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      await registerAPI({ name, email, password });
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
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
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Konfirmasi Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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

// HomePage Component
function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { error, data } = await getActiveNotesAPI();
        if (!error) {
          setNotes(data);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = keyword
    ? notes.filter((note) =>
        note.title.toLowerCase().includes(keyword.toLowerCase())
      )
    : notes;

  const handleKeywordChange = (newKeyword) => {
    if (newKeyword) {
      setSearchParams({ keyword: newKeyword });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return <main><p>Loading...</p></main>;
  }

  return (
    <main>
      <h2>Catatan Aktif</h2>
      <SearchBar keyword={keyword} onKeywordChange={handleKeywordChange} />
      <NotesList notes={filteredNotes} />
      <div className="homepage__action">
        <Link to="/notes/new" className="action" title="Tambah">+</Link>
      </div>
    </main>
  );
}

// DetailPage Component
function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { error, data } = await getNoteAPI(id);
        if (!error) {
          setNote(data);
        }
      } catch (err) {
        console.error('Error fetching note:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return <main><p>Loading...</p></main>;
  }

  if (!note) {
    return (
      <main>
        <h2>Catatan tidak ditemukan</h2>
        <div className="detail-page__action">
          <button onClick={() => navigate('/')} className="action" title="Kembali">←</button>
        </div>
      </main>
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus catatan ini?');
    if (confirmed) {
      try {
        await deleteNoteAPI(id);
        navigate('/');
      } catch (err) {
        alert('Gagal menghapus catatan');
      }
    }
  };

  const handleArchive = async () => {
    try {
      if (note.archived) {
        await unarchiveNoteAPI(id);
      } else {
        await archiveNoteAPI(id);
      }
      navigate('/');
    } catch (err) {
      alert('Gagal mengarsip catatan');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <main>
      <div className="detail-page">
        <h2 className="detail-page__title">{note.title}</h2>
        <p className="detail-page__createdAt">{showFormattedDate(note.createdAt)}</p>
        <div className="detail-page__body">{note.body}</div>
      </div>
      <div className="detail-page__action">
        <button onClick={handleBack} className="action" title="Kembali">←</button>
        <button onClick={handleArchive} className="action" title={note.archived ? "Batal Arsip" : "Arsip"}>
          {note.archived ? '📂' : '📁'}
        </button>
        <button onClick={handleDelete} className="action" title="Hapus">🗑️</button>
      </div>
    </main>
  );
}

// AddNotePage Component
function AddNotePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const maxTitleLength = 50;
  const remainingChars = maxTitleLength - title.length;

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= maxTitleLength) {
      setTitle(newTitle);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addNoteAPI({ title, body });
      navigate('/');
    } catch (err) {
      alert('Gagal menambah catatan');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <main>
      <div className="add-new-page__input">
        <p className="add-new-page__input__title__char-limit">
          Sisa karakter: {remainingChars}
        </p>
        <input
          type="text"
          className="add-new-page__input__title"
          placeholder="Catatan rahasia"
          value={title}
          onChange={handleTitleChange}
        />
        <textarea
          className="add-new-page__input__body"
          placeholder="Tulis disini"
          data-placeholder="Sebenarnya saya adalah ..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="add-new-page__action">
        <button onClick={handleBack} className="action" title="Kembali">←</button>
        <button onClick={handleSubmit} className="action" title="Simpan" disabled={loading}>✓</button>
      </div>
    </main>
  );
}

// ArchivedPage Component
function ArchivedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { error, data } = await getArchivedNotesAPI();
        if (!error) {
          setNotes(data);
        }
      } catch (err) {
        console.error('Error fetching archived notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = keyword
    ? notes.filter((note) =>
        note.title.toLowerCase().includes(keyword.toLowerCase())
      )
    : notes;

  const handleKeywordChange = (newKeyword) => {
    if (newKeyword) {
      setSearchParams({ keyword: newKeyword });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return <main><p>Loading...</p></main>;
  }

  return (
    <main>
      <h2>Catatan Arsip</h2>
      <SearchBar keyword={keyword} onKeywordChange={handleKeywordChange} />
      <NotesList notes={filteredNotes} />
    </main>
  );
}

// NotFoundPage Component
function NotFoundPage() {
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

// ProtectedRoute Component
function ProtectedRoute({ children }) {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" />;
}

// Main App Component
function App() {
  const [authedUser, setAuthedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

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
        <main><p>Loading...</p></main>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Notes App</h1>
          {authedUser && (
            <>
              <nav className="navigation">
                <ul>
                  <li><Link to="/">Aktif</Link></li>
                  <li><Link to="/archived">Arsip</Link></li>
                </ul>
              </nav>
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
