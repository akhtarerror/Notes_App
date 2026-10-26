import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showFormattedDate } from '../utils';
import {
  getNote as getNoteAPI,
  archiveNote as archiveNoteAPI,
  unarchiveNote as unarchiveNoteAPI,
  deleteNote as deleteNoteAPI,
} from '../utils/network-data';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { BackIcon, ArchiveIcon, UnarchiveIcon, TrashIcon } from '../components/Icons';

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

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
          <button onClick={() => navigate('/')} className="action" title="Kembali" aria-label="Kembali"><BackIcon /></button>
        </div>
      </main>
    );
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus catatan ini?');
    if (confirmed) {
      setActionLoading(true);
      setLoadingMessage('Menghapus catatan...');
      try {
        const { error } = await deleteNoteAPI(id);
        if (!error) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 800);
        } else {
          alert('Gagal menghapus catatan');
          setActionLoading(false);
        }
      } catch (err) {
        alert('Gagal menghapus catatan');
        setActionLoading(false);
      }
    }
  };

  const handleArchive = async () => {
    setActionLoading(true);
    setLoadingMessage(note.archived ? 'Membatalkan arsip...' : 'Mengarsip catatan...');
    try {
      let result;
      if (note.archived) {
        result = await unarchiveNoteAPI(id);
      } else {
        result = await archiveNoteAPI(id);
      }
      
      if (!result.error) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        alert('Gagal mengarsip catatan');
        setActionLoading(false);
      }
    } catch (err) {
      alert('Gagal mengarsip catatan');
      setActionLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <main>
      {actionLoading && <LoadingOverlay message={loadingMessage} success={success} />}
      <div className="detail-page">
        <h2 className="detail-page__title">{note.title}</h2>
        <p className="detail-page__createdAt">{showFormattedDate(note.createdAt)}</p>
        <div className="detail-page__body">{note.body}</div>
      </div>
      <div className="detail-page__action">
        <button onClick={handleBack} className="action" title="Kembali" aria-label="Kembali" disabled={actionLoading}><BackIcon /></button>
        <button onClick={handleArchive} className="action" title={note.archived ? "Batal Arsip" : "Arsip"} aria-label={note.archived ? "Batal Arsip" : "Arsip"} disabled={actionLoading}>
          {note.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
        </button>
        <button onClick={handleDelete} className="action action--danger" title="Hapus" aria-label="Hapus" disabled={actionLoading}><TrashIcon /></button>
      </div>
    </main>
  );
}