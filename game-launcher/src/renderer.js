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

  // Edit game modal
  const editGameModal = document.getElementById('editGameModal');
  const closeEditModalBtn = document.getElementById('close-edit-modal');

  if (editGameModal && closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', () => {
      editGameModal.style.display = 'none';
    });
  }

  const editGameForm = document.getElementById('edit-game-form');
  if (editGameForm) {
    editGameForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const gameId = document.getElementById('edit-game-id').value;
      const gameName = document.getElementById('edit-game-name').value;
      const gamePath = document.getElementById('edit-game-path').value;
      const iconUrl = document.getElementById('edit-icon-url').value;
      const coverUrl = document.getElementById('edit-cover-url').value;
      const backgroundUrl = document.getElementById('edit-background-url').value;

      const updatedGame = {
        id: gameId,
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
        await window.electron.updateGame(updatedGame);
        loadGames();
        editGameModal.style.display = 'none';
      } catch (error) {
        console.error('Error updating game:', error);
      }
    });
  }
});

function showEditModal(game) {
  // Populate the edit form with the game details
  document.getElementById('edit-game-id').value = game.id;
  document.getElementById('edit-game-name').value = game.name;
  document.getElementById('edit-game-path').value = game.path;
  document.getElementById('edit-icon-url').value = game.iconUrl;
  document.getElementById('edit-cover-url').value = game.coverUrl;
  document.getElementById('edit-background-url').value = game.backgroundUrl;

  // Show the edit modal
  const editGameModal = document.getElementById('editGameModal');
  if (editGameModal) {
    editGameModal.style.display = 'flex';
  }
}


async function loadGames() {
  try {
    const games = await window.electron.getGames();
    const gameContainer = document.getElementById('game-container');

    if (!gameContainer) {
      console.error('Game container element not found!');
      return;
    }

    gameContainer.innerHTML = '';

    for (const game of games) {
      const gameCard = document.createElement('div');
      const gameCardCover = document.createElement('div');
      gameCardCover.classList.add('game-card-cover');
      gameCard.appendChild(gameCardCover);
      const gameCardOverlay = document.createElement('div');
      gameCardOverlay.classList.add('game-overlay');
      gameCard.appendChild(gameCardOverlay);
      gameCard.classList.add('game-card');

      if (game.coverUrl) {
        // Set the background image for the cover
        gameCardCover.style.backgroundImage = `url(${game.coverUrl})`;

        // Load the image and extract the colors
        const img = new Image();
        img.src = game.coverUrl;
        img.crossOrigin = 'Anonymous'; // Ensure CORS is set for remote images
        img.onload = () => {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 2); // Extract two dominant colors

          if (palette && palette.length >= 2) {
            // Convert the palette RGB values to CSS format
            // const color1 = `rgb(${palette[0].join(',')})`;
            const color1 = `rgb(${palette[1].join(',')})`;
            const color2 = `var(--menu-bg)`;

            // Apply the linear gradient as the background of the game card
            gameCard.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
          }
        };
      }

      // Add cover art if available
      // if (game.coverUrl) {
      //   const coverArt = document.createElement('img');
      //   coverArt.classList.add('cover-art');
      //   coverArt.src = game.coverUrl;
      //   gameCardOverlay.appendChild(coverArt);
      // }
      const gameCardButtonsOverlay = document.createElement('div');
      gameCardButtonsOverlay.classList.add('game-card-buttons-overlay');
      gameCardOverlay.appendChild(gameCardButtonsOverlay);

      // Add game name
      const gameName = document.createElement('h3');
      gameName.textContent = game.name;
      gameCardOverlay.appendChild(gameName);

      // Launch button
      const launchButtonIcon = document.createElement('span');
      launchButtonIcon.classList.add('launch-button-icon');
      const launchButton = document.createElement('button');
      launchButton.appendChild(launchButtonIcon);

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

      // Add "Edit" button
      const editButton = document.createElement('button');
      editButton.textContent = '';
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', () => {
        showEditModal(game);
      });

      // append buttons
      gameCardButtonsOverlay.appendChild(editButton);
      gameCardButtonsOverlay.appendChild(launchButton);

      // Game playtime and last played information
      const infoLastPlayedTitle = document.createElement('p');
      infoLastPlayedTitle.textContent = 'Last Played:';
      infoLastPlayedTitle.classList.add('info-title');

      const infoLastPlayed = document.createElement('p');
      infoLastPlayed.textContent = `${game.lastOpened ? new Date(game.lastOpened).toLocaleString() : 'Never'}`;
      infoLastPlayed.classList.add('info-block');

      const infoPlayTimeTitle = document.createElement('p');
      infoPlayTimeTitle.textContent = 'Total Playtime:';
      infoPlayTimeTitle.classList.add('info-title');

      const infoPlayTime = document.createElement('p');
      infoPlayTime.textContent = `${formatPlaytime(game.totalPlaytime)}`;
      infoPlayTime.classList.add('info-block');

      gameCardOverlay.appendChild(infoLastPlayedTitle);
      gameCardOverlay.appendChild(infoLastPlayed);
      gameCardOverlay.appendChild(infoPlayTimeTitle);
      gameCardOverlay.appendChild(infoPlayTime);

      gameContainer.appendChild(gameCard);
    }
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

function formatPlaytime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  // const secs = seconds % 60;
  return `${hours}h ${minutes}m`;
}

