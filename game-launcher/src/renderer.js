document.addEventListener('DOMContentLoaded', () => {
  loadGames();

  const addGameBtn = document.getElementById('add-game-btn');
  const addGameModal = document.getElementById('addGameModal');
  const closeModalBtn = document.getElementById('close-modal');

  if (addGameBtn && addGameModal && closeModalBtn) {
    addGameBtn.addEventListener('click', () => {
      addGameModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
      addGameModal.style.display = 'none';
    });
  }

  const addGameForm = document.getElementById('add-game-form');
  if (addGameForm) {
    addGameForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const gameName = document.getElementById('game-name').value;
      const gamePath = document.getElementById('game-path').value;
      const iconUrl = document.getElementById('icon-url').value;
      const coverUrl = document.getElementById('cover-url').value;
      const backgroundUrl = document.getElementById('background-url').value;

      const newGame = {
        name: gameName,
        path: gamePath,
        iconUrl,
        coverUrl,
        backgroundUrl,
        lastOpened: null,
        totalPlaytime: 0,
        isRunning: 0
      };

      try {
        await window.electron.addGame(newGame);
        loadGames();
        addGameModal.style.display = 'none';
      } catch (error) {
        console.error('Error adding game:', error);
      }
    });
  }

  const browseBtn = document.getElementById('browse-btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', async () => {
      const filePath = await window.electron.browseForExe();
      if (filePath) {
        document.getElementById('game-path').value = filePath;
      }
    });
  }
});

async function loadGames() {
  try {
    const games = await window.electron.getGames();
    const gameContainer = document.getElementById('game-container');

    if (!gameContainer) {
      console.error('Game container element not found!');
      return;
    }

    gameContainer.innerHTML = '';

    games.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.classList.add('game-card');

      if (game.backgroundUrl) {
        gameCard.style.backgroundImage = `url(${game.backgroundUrl})`;
      }

      const gameIcon = document.createElement('img');
      gameIcon.classList.add('game-icon');
      gameIcon.src = game.iconUrl || ''; // Removed default-icon.png
      gameCard.appendChild(gameIcon);

      if (game.coverUrl) {
        const coverArt = document.createElement('img');
        coverArt.classList.add('cover-art');
        coverArt.src = game.coverUrl;
        gameCard.appendChild(coverArt);
      }

      const gameName = document.createElement('h3');
      gameName.textContent = game.name;
      gameCard.appendChild(gameName);

      const launchButton = document.createElement('button');
      launchButton.textContent = game.isRunning ? 'Stop' : 'Launch';
      launchButton.classList.add('launch-button');
      launchButton.addEventListener('click', async () => {
        try {
          if (launchButton.textContent === 'Launch') {
            await window.electron.launchGame(game.id);
            launchButton.textContent = 'Stop';
          } else {
            await window.electron.stopGame(game.id);
            launchButton.textContent = 'Launch';
          }
          loadGames(); // Refresh the game list
        } catch (error) {
          console.error('Error managing game:', error);
        }
      });
      gameCard.appendChild(launchButton);

      const info = document.createElement('p');
      info.textContent = `Last Played: ${game.lastOpened ? new Date(game.lastOpened).toLocaleString() : 'Never'} | Total Playtime: ${formatPlaytime(game.totalPlaytime)}`;
      gameCard.appendChild(info);

      gameContainer.appendChild(gameCard);
    });
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

function formatPlaytime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}
