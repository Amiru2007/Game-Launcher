function renderGameList(games) {
  const gameListContainer = document.querySelector('.game-list');
  if (!gameListContainer) {
    console.error('Game list container not found!');
    return;
  }

  gameListContainer.innerHTML = ''; // Clear previous content

  games.forEach(game => {
    const gameItem = document.createElement('li');
    gameItem.classList.add('game-item');

    // Cover Art
    if (game.coverUrl) {
      const coverImage = document.createElement('img');
      coverImage.src = game.coverUrl;
      coverImage.alt = `Cover art for ${game.name}`;
      coverImage.classList.add('game-cover');
      gameItem.appendChild(coverImage);
    }

    const gameListItemText = document.createElement('div');
    gameListItemText.classList.add('game-list-item-text');
    
    
    // Game Name
    const gameName = document.createElement('span');
    gameName.textContent = game.name;
    gameListItemText.appendChild(gameName);
    
    const gameCompany = document.createElement('span');
    gameCompany.textContent = game.company;
    gameListItemText.appendChild(gameCompany);

    gameItem.appendChild(gameListItemText);

    const launchButtonContainer = document.createElement('div');
    launchButtonContainer.classList.add('launch-button-container');

    const launchButtonIcon = document.createElement('span');
    launchButtonIcon.classList.add('launch-button-icon');
    const launchButton = document.createElement('button');
    launchButtonContainer.appendChild(launchButtonIcon);

    launchButton.textContent = game.isRunning ? 'Stop' : 'Launch';
    launchButton.classList.add('launch-button');
    
    // Set aria-label based on button state
    launchButton.setAttribute('aria-label', game.isRunning ? 'Stop' : 'Launch');
    
    launchButton.addEventListener('click', async () => {
      try {
        if (launchButton.textContent === 'Launch') {
          await window.electron.launchGame(game.id); // Launch the game
          launchButton.textContent = 'Stop'; // Change button text to 'Stop'
          launchButton.setAttribute('aria-label', 'Stop'); // Update aria-label
        } else {
          await window.electron.stopGame(game.id); // Stop the game
          launchButton.textContent = 'Launch'; // Change button text back to 'Launch'
          launchButton.setAttribute('aria-label', 'Launch'); // Update aria-label
        }
        loadGames(); // Reload game list to reflect state changes
      } catch (error) {
        console.error('Error managing game:', error);
      }
    });

    gameItem.appendChild(launchButtonContainer);
    // // Last Opened
    // const lastOpened = document.createElement('p');
    // lastOpened.textContent = `Last Opened: ${game.lastOpened ? new Date(game.lastOpened).toLocaleString() : 'Never'}`;
    // lastOpened.classList.add('game-last-opened');
    // gameItem.appendChild(lastOpened);

    // // Total Playtime
    // const playtime = document.createElement('p');
    // playtime.textContent = `Total Playtime: ${formatPlaytime(game.totalPlaytime)}`;
    // playtime.classList.add('game-playtime');
    // gameItem.appendChild(playtime);

    gameListContainer.appendChild(gameItem);
  });
}

async function loadAndRenderGames() {
  try {
    const games = await window.electron.getGames(); // Fetch games from the backend
    renderGameList(games);
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('games.html')) {
    loadGames(); // Should remain as is
  } else if (window.location.pathname.endsWith('index.html')) {
    loadAndRenderGames(); // Ensure the right function is called
  }

  // Event listener for back button
  const backButton = document.getElementById('back-to-home');
  if (backButton) {
      backButton.addEventListener('click', () => {
          window.location.href = 'index.html';  // Redirect back to the home page
      });
  }
  
  const galleryButton = document.getElementById('go-to-gallery');
  if (galleryButton) {
      galleryButton.addEventListener('click', () => {
          window.location.href = 'games.html';  // Redirect to the game gallery page
      });
  }
  // loadGames();

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
      const company = document.getElementById('company').value; // Get company field

      const newGame = {
        name: gameName,
        path: gamePath,
        iconUrl,
        coverUrl,
        backgroundUrl,
        company, // Add company field here
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
    console.log('Games loaded:', games); // Verify the received data
    const gameContainer = document.getElementById('game-container');
    const overlayImage = document.getElementById('overlay-img');

    if (!gameContainer || !overlayImage) {
      console.error('Game container or overlay image element not found!');
      return;
    }

    gameContainer.innerHTML = ''; // Clear existing content

    games.forEach(game => {
      const gameCard = document.createElement('div');
      const gameCardCover = document.createElement('div');
      gameCardCover.classList.add('game-card-cover');
      gameCard.appendChild(gameCardCover);

      const gameCardOverlay = document.createElement('div');
      gameCardOverlay.classList.add('game-overlay');
      gameCard.appendChild(gameCardOverlay);
      gameCard.classList.add('game-card');

      const gameCardIcon = document.createElement('div');
      gameCardIcon.classList.add('game-card-icon');

      if (game.coverUrl) {
        // Set cover background image
        gameCardCover.style.backgroundImage = `url(${game.coverUrl})`;

        // Extract accent color using Vibrant.js
        // const img = new Image();
        // img.src = game.coverUrl;
        // img.crossOrigin = 'Anonymous'; // Cross-origin for CORS compliant images
        // img.onload = () => {
        //   // Vibrant.js to extract vibrant color (accent color)
        //   Vibrant.from(img).getPalette((err, palette) => {
        //     if (err) {
        //       console.error('Error extracting color palette:', err);
        //       return;
        //     }

        //     // Extract vibrant color or fallback to muted if vibrant isn't available
        //     const vibrantColor = palette.Vibrant ? palette.Vibrant.getRgb() : palette.Muted.getRgb();
        //     const color1 = `rgb(${vibrantColor.join(',')})`;
        //     const color2 = `#111111bf`; // Fallback to a CSS variable

        //     gameCard.style.background = `linear-gradient(to right, ${color1}, ${color2})`; // Gradient background
        //   });
        // };
      }

      if (game.iconUrl) {
        gameCardIcon.style.backgroundImage = `url(${game.iconUrl})`;
      }

      gameCardOverlay.appendChild(gameCardIcon);
      // Overlay image update on hover
      // if (game.backgroundUrl) {
      //   gameCard.addEventListener('mouseenter', () => {
      //     overlayImage.classList.remove('visible'); // Hide the image
      //     overlayImage.src = game.backgroundUrl; // Change overlay image
      //     // Trigger reflow to apply the new image before transitioning
      //     overlayImage.offsetHeight; 
      //     overlayImage.classList.add('visible'); // Fade in the new image
      //   });
      // }

      // Buttons overlay div
      const gameCardButtonsOverlay = document.createElement('div');
      gameCardButtonsOverlay.classList.add('game-card-buttons-overlay');
      gameCardOverlay.appendChild(gameCardButtonsOverlay);

      // Add game name
      const gameName = document.createElement('h3');
      gameName.textContent = game.name;
      gameCardOverlay.appendChild(gameName);

      // const gameYear = document.createElement('p');
      // gameYear.classList.add('game-year');
      // gameYear.textContent = game.year;
      // gameCardOverlay.appendChild(gameYear);

      // Launch/Stop Button
      const launchButtonIcon = document.createElement('span');
      launchButtonIcon.classList.add('launch-button-icon');
      const launchButton = document.createElement('button');
      launchButton.appendChild(launchButtonIcon);

      launchButton.textContent = game.isRunning ? 'Stop' : 'Launch';
      launchButton.classList.add('launch-button');
      
      // Set aria-label based on button state
      launchButton.setAttribute('aria-label', game.isRunning ? 'Stop' : 'Launch');
      
      launchButton.addEventListener('click', async () => {
        try {
          if (launchButton.textContent === 'Launch') {
            await window.electron.launchGame(game.id); // Launch the game
            launchButton.textContent = 'Stop'; // Change button text to 'Stop'
            launchButton.setAttribute('aria-label', 'Stop'); // Update aria-label
          } else {
            await window.electron.stopGame(game.id); // Stop the game
            launchButton.textContent = 'Launch'; // Change button text back to 'Launch'
            launchButton.setAttribute('aria-label', 'Launch'); // Update aria-label
          }
          loadGames(); // Reload game list to reflect state changes
        } catch (error) {
          console.error('Error managing game:', error);
        }
      });

      // "Edit" button for each game
      const editButton = document.createElement('button');
      editButton.textContent = ''; // Icon can be added with CSS or a font library
      editButton.classList.add('edit-button');
      editButton.addEventListener('click', () => {
        showEditModal(game); // Trigger modal to edit game details
      });

      // Append buttons to the overlay
      gameCardButtonsOverlay.appendChild(editButton);
      gameCardButtonsOverlay.appendChild(launchButton);

      // Last Played Info
      const infoLastPlayedTitle = document.createElement('p');
      infoLastPlayedTitle.textContent = 'Last Played:';
      infoLastPlayedTitle.classList.add('info-title');

      const infoLastPlayed = document.createElement('p');
      infoLastPlayed.textContent = `${game.lastOpened ? new Date(game.lastOpened).toLocaleString() : 'Never'}`;
      infoLastPlayed.classList.add('info-block');

      // Total Playtime Info
      const infoPlayTimeTitle = document.createElement('p');
      infoPlayTimeTitle.textContent = 'Total Playtime:';
      infoPlayTimeTitle.classList.add('info-title');

      const infoPlayTime = document.createElement('p');
      infoPlayTime.textContent = `${formatPlaytime(game.totalPlaytime)}`;
      infoPlayTime.classList.add('info-block');

      // Append playtime and last played details
      gameCardOverlay.appendChild(infoLastPlayedTitle);
      gameCardOverlay.appendChild(infoLastPlayed);
      gameCardOverlay.appendChild(infoPlayTimeTitle);
      gameCardOverlay.appendChild(infoPlayTime);

      // Append the card to the game container
      gameContainer.appendChild(gameCard);
    });
  } catch (error) {
    console.error('Error loading games:', error.message);
  }
}

function formatPlaytime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
