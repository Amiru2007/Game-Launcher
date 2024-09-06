const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../userData/games.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      path TEXT,
      iconUrl TEXT,
      coverUrl TEXT,
      backgroundUrl TEXT,
      lastOpened TEXT,
      totalPlaytime INTEGER,
      isRunning INTEGER
    )`);
  }
});

module.exports = db;
