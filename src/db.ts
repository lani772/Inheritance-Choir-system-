import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'choir.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attendees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    composer TEXT,
    notes TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS song_files (
    id TEXT PRIMARY KEY,
    song_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL,
    due_date TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export const getEvents = () => {
  const events = db.prepare('SELECT * FROM events').all();
  const attendees = db.prepare('SELECT * FROM attendees').all();
  
  return events.map(event => ({
    ...event,
    attendees: attendees.filter(a => a.event_id === event.id).map(a => a.name)
  }));
};

export const addEvent = (event) => {
  const stmt = db.prepare('INSERT INTO events (id, title, date, time, location, type) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(event.id, event.title, event.date, event.time, event.location, event.type);
  
  if (event.attendees && event.attendees.length > 0) {
    const attendeeStmt = db.prepare('INSERT INTO attendees (event_id, name) VALUES (?, ?)');
    event.attendees.forEach(name => {
      attendeeStmt.run(event.id, name);
    });
  }
  
  return event;
};

export const addAttendee = (eventId, name) => {
  const stmt = db.prepare('INSERT INTO attendees (event_id, name) VALUES (?, ?)');
  stmt.run(eventId, name);
  return { eventId, name };
};

export const removeAttendee = (eventId, name) => {
  const stmt = db.prepare('DELETE FROM attendees WHERE event_id = ? AND name = ?');
  stmt.run(eventId, name);
  return { eventId, name };
};

export const getSongs = () => {
  const songs = db.prepare('SELECT * FROM songs ORDER BY created_at DESC').all();
  const files = db.prepare('SELECT * FROM song_files').all();
  
  return songs.map(song => ({
    ...song,
    files: files.filter(f => f.song_id === song.id)
  }));
};

export const addSong = (song) => {
  const stmt = db.prepare('INSERT INTO songs (id, title, composer, notes, created_at) VALUES (?, ?, ?, ?, ?)');
  stmt.run(song.id, song.title, song.composer, song.notes, song.created_at);
  return song;
};

export const addSongFile = (file) => {
  const stmt = db.prepare('INSERT INTO song_files (id, song_id, file_name, file_path, file_type, uploaded_at) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(file.id, file.song_id, file.file_name, file.file_path, file.file_type, file.uploaded_at);
  return file;
};

export const deleteSong = (id) => {
  const stmt = db.prepare('DELETE FROM songs WHERE id = ?');
  stmt.run(id);
  return { id };
};

export const deleteSongFile = (id) => {
  const stmt = db.prepare('DELETE FROM song_files WHERE id = ?');
  stmt.run(id);
  return { id };
};

export const getSongFile = (id) => {
  return db.prepare('SELECT * FROM song_files WHERE id = ?').get(id);
};

export const getTasks = () => {
  return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
};

export const addTask = (task) => {
  const stmt = db.prepare('INSERT INTO tasks (id, title, description, priority, due_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmt.run(task.id, task.title, task.description, task.priority, task.due_date, task.status, task.created_at);
  return task;
};

export const updateTask = (id, updates) => {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  const stmt = db.prepare(`UPDATE tasks SET ${fields} WHERE id = ?`);
  stmt.run(...values, id);
  return { id, ...updates };
};

export const deleteTask = (id) => {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
  return { id };
};
