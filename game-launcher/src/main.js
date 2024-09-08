const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec, execSync } = require('child_process');
const db = require('./database');

let mainWindow;
let processMap = new Map(); // To keep track of running processes

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });

  mainWindow.loadFile('public/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('get-games', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM games', [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
});

ipcMain.handle('add-game', async (event, game) => {
  return new Promise((resolve, reject) => {
    const { name, path, iconUrl, coverUrl, backgroundUrl, lastOpened, totalPlaytime, isRunning } = game;
    db.run('INSERT INTO games (name, path, iconUrl, coverUrl, backgroundUrl, lastOpened, totalPlaytime, isRunning) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [name, path, iconUrl, coverUrl, backgroundUrl, lastOpened, totalPlaytime, isRunning],
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      });
  });
});

ipcMain.handle('update-game', async (event, game) => {
  return new Promise((resolve, reject) => {
    const { id, name, path, iconUrl, coverUrl, backgroundUrl } = game;
    db.get('SELECT * FROM games WHERE id = ?', [id], (err, existingGame) => {
      if (err) {
        return reject(err);
      }

      if (!existingGame) {
        return reject(new Error('Game not found.'));
      }

      // Retain existing values for lastOpened and totalPlaytime
      const lastOpened = game.lastOpened || existingGame.lastOpened;
      const totalPlaytime = game.totalPlaytime || existingGame.totalPlaytime;

      db.run(
        'UPDATE games SET name = ?, path = ?, iconUrl = ?, coverUrl = ?, backgroundUrl = ?, lastOpened = ?, totalPlaytime = ? WHERE id = ?',
        [name, path, iconUrl, coverUrl, backgroundUrl, lastOpened, totalPlaytime, id],
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

ipcMain.handle('launch-game', async (event, gameId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM games WHERE id = ?', [gameId], (err, game) => {
      if (err) {
        return reject(err);
      }

      if (!game || !game.path) {
        return reject(new Error('Game path is missing.'));
      }

      // Launch the game
      const proc = exec(`"${game.path}"`, (error) => {
        if (error) {
          console.error('Error launching game:', error);
        }
      });

      // Track the process
      processMap.set(gameId, proc);

      // Update database
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

ipcMain.handle('stop-game', async (event, gameId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM games WHERE id = ?', [gameId], (err, game) => {
      if (err) {
        return reject(err);
      }

      if (!game || !processMap.has(gameId)) {
        return reject(new Error('No running process found for this game.'));
      }

      // Stop the game
      const proc = processMap.get(gameId);
      proc.kill('SIGTERM');
      processMap.delete(gameId);

      // Calculate playtime
      const now = Date.now();
      const lastOpened = new Date(game.lastOpened).getTime();
      const playtime = Math.floor((now - lastOpened) / 1000); // In seconds

      // Update database
      db.run('UPDATE games SET totalPlaytime = totalPlaytime + ?, isRunning = 0 WHERE id = ?', [playtime, gameId], (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
});

ipcMain.handle('browse-for-exe', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Executables', extensions: ['exe'] }]
  });
  return result.filePaths[0];
});
