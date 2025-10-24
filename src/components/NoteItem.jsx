import React from 'react';
import { Link } from 'react-router-dom';
import { showFormattedDate } from '../utils';

export function NoteItem({ note }) {
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