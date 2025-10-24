import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showFormattedDate } from '../utils';
import {
  getNote as getNoteAPI,
  archiveNote as archiveNoteAPI,
  unarchiveNote as unarchiveNoteAPI,
  deleteNote as deleteNoteAPI,
} from '../utils/network-data';

export function DetailPage() {
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