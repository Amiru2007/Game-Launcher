// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electron', {
//   getGames: () => ipcRenderer.invoke('get-games'),
//   addGame: (game) => ipcRenderer.invoke('add-game', game),
//   updateGame: (game) => ipcRenderer.invoke('update-game', game),
//   deleteGame: (gameId) => ipcRenderer.invoke('delete-game', gameId),
//   launchGame: (gamePath) => ipcRenderer.invoke('launch-game', gamePath),
//   stopGame: (gameName) => ipcRenderer.invoke('stop-game', gameName),
//   browseForExe: () => ipcRenderer.invoke('browse-for-exe')
// });

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getGames: () => ipcRenderer.invoke('get-games'),
  addGame: (game) => ipcRenderer.invoke('add-game', game),
  updateGame: (game) => ipcRenderer.invoke('update-game', game),
  launchGame: (gameId) => ipcRenderer.invoke('launch-game', gameId),
  stopGame: (gameId) => ipcRenderer.invoke('stop-game', gameId),
  browseForExe: () => ipcRenderer.invoke('browse-for-exe'),
  getGameById: (gameId) => ipcRenderer.invoke('get-game-by-id', gameId),
  getRecentlyAddedGames: (limit = 3) => ipcRenderer.invoke('get-recently-added-games', limit),
  getTopPlaytimeGames: () => ipcRenderer.invoke('get-top-playtime-games'),
  getTotalPlaytime: () => ipcRenderer.invoke('get-total-playtime')
});
