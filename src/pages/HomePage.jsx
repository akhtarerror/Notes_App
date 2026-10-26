import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { NotesList } from '../components/NotesList';
import { getActiveNotes as getActiveNotesAPI } from '../utils/network-data';
import { PlusIcon } from '../components/Icons';

export function HomePage() {
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
        <Link to="/notes/new" className="action action--primary action--fab" title="Tambah" aria-label="Tambah">
          <PlusIcon size={28} />
        </Link>
      </div>
    </main>
  );
}
