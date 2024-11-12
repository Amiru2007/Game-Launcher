const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'games.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    company TEXT,
    path TEXT,
    iconUrl TEXT,
    textLogo TEXT,
    coverUrl TEXT,
    backgroundUrl TEXT,
    lastOpened TEXT,
    totalPlaytime INTEGER,
    isRunning INTEGER
  )`);
});

module.exports = db;