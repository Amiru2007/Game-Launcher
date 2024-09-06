const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: (game) => ipcRenderer.invoke('add-game', game),
  updateGame: (game) => ipcRenderer.invoke('update-game', game),
  deleteGame: (gameId) => ipcRenderer.invoke('delete-game', gameId),
  launchGame: (gamePath) => ipcRenderer.invoke('launch-game', gamePath),
  stopGame: (gameName) => ipcRenderer.invoke('stop-game', gameName),
  browseForExe: () => ipcRenderer.invoke('browse-for-exe')
});
