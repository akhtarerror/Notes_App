import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNote as addNoteAPI } from '../utils/network-data';
import { LoadingOverlay } from '../components/LoadingOverlay';

export function AddNotePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      const { error } = await addNoteAPI({ title, body });
      if (!error) {
        // Show success animation
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        alert('Gagal menambah catatan');
        setLoading(false);
      }
    } catch (err) {
      alert('Gagal menambah catatan');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <main>
      {loading && <LoadingOverlay message="Menyimpan catatan..." success={success} />}
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
          disabled={loading}
        />
        <textarea
          className="add-new-page__input__body"
          placeholder="Tulis disini"
          data-placeholder="Sebenarnya saya adalah ..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="add-new-page__action">
        <button onClick={handleBack} className="action" title="Kembali" disabled={loading}>←</button>
        <button onClick={handleSubmit} className="action" title="Simpan" disabled={loading}>✓</button>
      </div>
    </main>
  );
}