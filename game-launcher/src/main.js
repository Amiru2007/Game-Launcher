const processMap = new Map(); 
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose(); // Make sure to include sqlite3 if you are using it

// Define the path to the database
const dbPath = path.join(app.getPath('userData'), 'games.db');

// Initialize the database
const db = require('./database'); // Ensure this path is correct

// Function to create the main window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'public', 'index.html'));

  // Open DevTools in production
  mainWindow.webContents.openDevTools({ mode: 'detach' });
}

// Event when app is ready
app.whenReady().then(createWindow);

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create the window when the app is activated (macOS specific behavior)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

// Get the list of games from the database
ipcMain.handle('get-games', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM games', [], (err, rows) => {
      if (err) {
        console.error('Error fetching games:', err.message);
        reject(err);
      } else {
        console.log('Fetched games:', rows); // Verify data here
        resolve(rows);
      }
    });
  });
});

// Handle the get-recently-added-games request from the renderer
ipcMain.handle('get-recently-added-games', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM games', [], (err, rows) => {
      if (err) {
        console.error('Error fetching games:', err.message);
        reject(err);
      } else {
        console.log('Fetched games:', rows); // Verify data here
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('get-top-playtime-games', async () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT name, company, backgroundUrl, totalPlaytime, textLogo
      FROM games
      ORDER BY totalPlaytime DESC
      LIMIT 3
    `, (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('get-total-playtime', async () => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT SUM(totalPlaytime) as totalPlaytime FROM games`, (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(row.totalPlaytime || 0);
      }
    });
  });
});

// Add a new game to the database
ipcMain.handle('add-game', async (event, game) => {
  return new Promise((resolve, reject) => {
    const { name, company, path, iconUrl, textLogo, coverUrl, backgroundUrl, lastOpened, totalPlaytime, isRunning } = game;

    // Insert the new game into the database, omitting the 'id' column as it's auto-incremented
    db.run('INSERT INTO games (name, company, path, iconUrl, textLogo, coverUrl, backgroundUrl, lastOpened, totalPlaytime, isRunning) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [name, company, path, iconUrl, textLogo, coverUrl, backgroundUrl, lastOpened, totalPlaytime, isRunning],
      function (err) {
        if (err) {
          reject(err);  // Reject the promise if there was an error
        } else {
          resolve(this.lastID);  // Resolve the promise with the ID of the new game
        }
      });
  });
});

// Update an existing game's information
ipcMain.handle('update-game', async (event, game) => {
  return new Promise((resolve, reject) => {
    const { id, name, company, path, iconUrl, textLogo, coverUrl, backgroundUrl } = game;
    db.get('SELECT * FROM games WHERE id = ?', [id], (err, existingGame) => {
      if (err) {
        return reject(err);
      }

      if (!existingGame) {
        return reject(new Error('Game not found.'));
      }

      const lastOpened = game.lastOpened || existingGame.lastOpened;
      const totalPlaytime = game.totalPlaytime || existingGame.totalPlaytime;

      db.run(
        'UPDATE games SET name = ?, company = ?, path = ?, iconUrl = ?, textLogo = ?, coverUrl = ?, backgroundUrl = ?, lastOpened = ?, totalPlaytime = ? WHERE id = ?',
        [name, company, path, iconUrl, textLogo, coverUrl, backgroundUrl, lastOpened, totalPlaytime, id],
        function (err) {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  });
});

// Launch a game by its ID
ipcMain.handle('launch-game', async (event, gameId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM games WHERE id = ?', [gameId], (err, game) => {
      if (err) {
        return reject(err);
      }

      if (!game || !game.path) {
        return reject(new Error('Game path is missing.'));
      }

      const proc = exec(`"${game.path}"`, (error) => {
        if (error) {
          console.error('Error launching game:', error);
        }
      });

      // Track the process
      processMap.set(gameId, proc);

      const now = new Date().toISOString();
      db.run('UPDATE games SET lastOpened = ?, isRunning = 1 WHERE id = ?', [now, gameId], (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
});

// Stop a game by its ID
ipcMain.handle('stop-game', async (event, gameId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM games WHERE id = ?', [gameId], (err, game) => {
      if (err) {
        return reject(err);
      }

      if (!game || !processMap.has(gameId)) {
        return reject(new Error('No running process found for this game.'));
      }

      const proc = processMap.get(gameId);
      proc.kill('SIGTERM');
      processMap.delete(gameId);

      const now = Date.now();
      const lastOpened = new Date(game.lastOpened).getTime();
      const playtime = Math.floor((now - lastOpened) / 1000); // In seconds

      db.run('UPDATE games SET totalPlaytime = totalPlaytime + ?, isRunning = 0 WHERE id = ?', [playtime, gameId], (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
});

// Handle request to get game details by ID
ipcMain.handle('get-game-by-id', async (event, gameId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM games WHERE id = ?', [gameId], (err, game) => {
      if (err) {
        console.error('Error fetching game details:', err.message);
        return reject(err);
      }
      if (!game) {
        console.error(`Game with id ${gameId} not found.`);
        return reject(new Error('Game not found'));
      }
      resolve(game);
    });
  });
});

// Open a file dialog to select an executable
ipcMain.handle('browse-for-exe', async () => {
  const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    properties: ['openFile'],
    filters: [{ name: 'Executables', extensions: ['exe'] }]
  });
  return result.filePaths[0];
});

app.on('before-quit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database connection:', err);
    }
  });
});