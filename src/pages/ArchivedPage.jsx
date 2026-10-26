import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { NotesList } from '../components/NotesList';
import { getArchivedNotes as getArchivedNotesAPI } from '../utils/network-data';

export function ArchivedPage() {
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