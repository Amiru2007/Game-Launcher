function renderGameList(games) {
  const mainCardsContainer = document.querySelector('#mainCardsContainer');

  if (!mainCardsContainer) {
      console.error('Main cards container not found!');
      return;
  }

  mainCardsContainer.innerHTML = ''; // Clear previous content

  // Filter and sort games based on lastOpened, then get the recent three games
  const recentGames = games
      .filter(game => game.lastOpened) // Ensure lastOpened is defined
      .sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened)) // Sort by lastOpened date, most recent first
      .slice(0, 3); // Get only the first three games

  recentGames.forEach(game => {
      // Create the main container for each game card
      const gameCard = document.createElement('div');
      gameCard.classList.add('game-card');
      const coverImageContainer = document.createElement('div');
      coverImageContainer.classList.add('game-cover-container');

      // Create the absolute positioned cover container (background)
      const coverImageBackgroundContainer = document.createElement('div');
      const coverImageBackground = document.createElement('div');
      const coverImageBackgroundOverlay = document.createElement('div');
      coverImageBackgroundContainer.classList.add('game-cover-background-container');
      coverImageBackground.classList.add('game-cover-background');
      coverImageBackgroundOverlay.classList.add('game-cover-background-overlay');
      if (game.coverUrl) {
          coverImageBackground.style.backgroundImage = `url('${game.coverUrl}')`;
      }

      coverImageBackgroundContainer.appendChild(coverImageBackground);
      coverImageBackgroundContainer.appendChild(coverImageBackgroundOverlay);
      gameCard.appendChild(coverImageBackgroundContainer);

      // Cover Art
      if (game.coverUrl) {
          const coverImage = document.createElement('img');
          coverImage.src = game.coverUrl;

          coverImage.alt = `Cover art for ${game.name}`;

          coverImage.classList.add('game-cover');

          coverImageContainer.appendChild(coverImage);
      }

      // Game Information Container
      const gameInfoContainer = document.createElement('div');
      gameInfoContainer.classList.add('game-info-container');

      // Game Name
      const gameName = document.createElement('span');
      if (game.textLogo) {
        gameName.style.backgroundImage = `url('${game.textLogo}')`;
        gameName.classList.add('text-logo-available');
      } else {
        gameName.textContent = game.name;
      }

      gameInfoContainer.appendChild(gameName);

      // Game Company
      // const gameCompany = document.createElement('span');
      // gameCompany.textContent = game.company;
      // gameInfoContainer.appendChild(gameCompany);

      // Append the info container to the game card
      coverImageContainer.appendChild(gameInfoContainer);
      gameCard.appendChild(coverImageContainer);

      // Launch Button Container
      const launchButtonContainer = document.createElement('div');
      launchButtonContainer.classList.add('launch-button-container');

      const launchButtonIcon = document.createElement('span');
      launchButtonIcon.classList.add('launch-button-icon');
      launchButtonContainer.appendChild(launchButtonIcon);

      const launchButton = document.createElement('button');
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

      launchButtonContainer.appendChild(launchButton);
      gameInfoContainer.appendChild(launchButtonContainer);

      mainCardsContainer.appendChild(gameCard);
  });
}

function renderNewGameList(games) {
  const mainNewCardsContainer = document.getElementById('mainNewCardsContainer');

  if (!mainNewCardsContainer) {
      console.error('Main cards container not found!');
      return;
  }

  mainNewCardsContainer.innerHTML = ''; // Clear previous content

  // Filter and sort games based on id, then get the recent three games
  const recentNewGames = games
      .filter(game => game.id) // Ensure id is defined
      .sort((a, b) => b.id - a.id) // Sort by id in descending order (most recent first)
      .slice(0, 3); // Get only the first three games

      recentNewGames.forEach(game => {
      // Create the main container for each game card
      const gameCard = document.createElement('div');
      gameCard.classList.add('game-card');
      const coverImageContainer = document.createElement('div');
      coverImageContainer.classList.add('game-cover-container');

      // Create the absolute positioned cover container (background)
      const coverImageBackgroundContainer = document.createElement('div');
      const coverImageBackground = document.createElement('div');
      const coverImageBackgroundOverlay = document.createElement('div');
      coverImageBackgroundContainer.classList.add('game-cover-background-container');
      coverImageBackground.classList.add('game-cover-background');
      coverImageBackgroundOverlay.classList.add('game-cover-background-overlay');
      if (game.coverUrl) {
          coverImageBackground.style.backgroundImage = `url('${game.coverUrl}')`;
      }

      coverImageBackgroundContainer.appendChild(coverImageBackground);
      coverImageBackgroundContainer.appendChild(coverImageBackgroundOverlay);
      gameCard.appendChild(coverImageBackgroundContainer);

      // Cover Art
      if (game.coverUrl) {
          const coverImage = document.createElement('img');
          coverImage.src = game.coverUrl;

          coverImage.alt = `Cover art for ${game.name}`;

          coverImage.classList.add('game-cover');

          coverImageContainer.appendChild(coverImage);
      }

      // Game Information Container
      const gameInfoContainer = document.createElement('div');
      gameInfoContainer.classList.add('game-info-container');

      // Game Name
      const gameName = document.createElement('span');
      if (game.textLogo) {
        gameName.style.backgroundImage = `url('${game.textLogo}')`;
        gameName.classList.add('text-logo-available');
      } else {
        gameName.textContent = game.name;
      }

      gameInfoContainer.appendChild(gameName);

      // Game Company
      // const gameCompany = document.createElement('span');
      // gameCompany.textContent = game.company;
      // gameInfoContainer.appendChild(gameCompany);

      // Append the info container to the game card
      coverImageContainer.appendChild(gameInfoContainer);
      gameCard.appendChild(coverImageContainer);

      // Launch Button Container
      const launchButtonContainer = document.createElement('div');
      launchButtonContainer.classList.add('launch-button-container');

      const launchButtonIcon = document.createElement('span');
      launchButtonIcon.classList.add('launch-button-icon');
      launchButtonContainer.appendChild(launchButtonIcon);

      const launchButton = document.createElement('button');
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
                  game.isRunning = true; // Update game status
              } else {
                  await window.electron.stopGame(game.id); // Stop the game
                  launchButton.textContent = 'Launch'; // Change button text back to 'Launch'
                  launchButton.setAttribute('aria-label', 'Launch'); // Update aria-label
                  game.isRunning = false; // Update game status
              }
              loadGames(); // Reload game list to reflect state changes
          } catch (error) {
              console.error('Error managing game:', error);
          }
      });

      launchButtonContainer.appendChild(launchButton);
      gameInfoContainer.appendChild(launchButtonContainer);

      mainNewCardsContainer.appendChild(gameCard);
  });
}

function renderTopPlaytimeGames() {
  console.log("Function renderTopPlaytimeGames started.");

  const mainNewCardsContainer = document.querySelector('#playingDataContainer');

  if (!mainNewCardsContainer) {
      console.error('Playing data container not found!');
      return;
  }

  console.log("Fetching top playtime games...");

  // Fetch top 3 games by playtime
  window.electron.getTopPlaytimeGames()
      .then(topPlaytimeGames => {
          // console.log("Top playtime games fetched:", topPlaytimeGames);

          // Fetch the total playtime
          return window.electron.getTotalPlaytime().then(totalPlaytime => {
              // console.log("Total playtime fetched:", totalPlaytime);

              // Clear previous content
              mainNewCardsContainer.innerHTML = '';

              // Display total playtime
              const totalPlaytimeElement = document.createElement('div');
              totalPlaytimeElement.classList.add('total-playtime');
              totalPlaytimeElement.textContent = `Total Playtime:`;
              mainNewCardsContainer.appendChild(totalPlaytimeElement);

              const gameCardsHeader = document.createElement('div');
              gameCardsHeader.classList.add('gameCardsHeader');
              gameCardsHeader.textContent = `Most Played Games`;
              mainNewCardsContainer.appendChild(gameCardsHeader);

              // Display total playtime
              const totalPlaytimeData = document.createElement('span');
              totalPlaytimeData.classList.add('total-playtime-data');
              totalPlaytimeData.textContent = `${formatPlaytimeInHours(totalPlaytime)}`;
              totalPlaytimeElement.appendChild(totalPlaytimeData);

              // Render each game card for the top 3 games by playtime
              topPlaytimeGames.forEach(game => {
                  // console.log(`Rendering game card for: ${game.name}`);

                  // Create game card
                  const gameCard = document.createElement('div');
                  gameCard.classList.add('game-card');
                  gameCard.classList.add('playtime-game-card');

                  const coverImage = document.createElement('img');
                  coverImage.classList.add('game-cover');

                  // Cover Art backgroundUrl
                  if (game.backgroundUrl) {
                      coverImage.src = game.backgroundUrl;
                      coverImage.alt = `Cover art for ${game.name}`;
                  }

                  gameCard.appendChild(coverImage);

                  // Game Info
                  const gameInfoContainer = document.createElement('div');
                  gameInfoContainer.classList.add('game-info-container');

                  const gameInfoContainerMonoLogo = document.createElement('div');
                  gameInfoContainerMonoLogo.classList.add('game-info-container-mono-logo');

                  if (game.textLogo) {
                    gameInfoContainerMonoLogo.style.backgroundImage = `url('${game.textLogo}')`;
                  } else {
                    gameInfoContainerMonoLogo.textContent = game.name;
                  }

                  // Playtime Display
                  const gamePlaytime = document.createElement('span');
                  gamePlaytime.classList.add('game-playtime');
                  gamePlaytime.textContent = `${formatPlaytime(game.totalPlaytime)}`;

                  gameInfoContainer.appendChild(gameInfoContainerMonoLogo);
                  gameInfoContainer.appendChild(gamePlaytime);

                  gameCard.appendChild(gameInfoContainer);

                  mainNewCardsContainer.appendChild(gameCard);
              });
          });
      })
      .catch(error => {
          console.error('Error loading top playtime games:', error);
      });
}

function formatPlaytimeInHours(seconds) {
  const hours = Math.floor(seconds / 3600);
  return `${hours} h`;
}

function addLaunchButton(gameCard, game) {
  const launchButton = document.createElement('button');
  launchButton.classList.add('launch-button');
  launchButton.textContent = game.isRunning ? 'Stop' : 'Launch';

  launchButton.addEventListener('click', async (e) => {
      e.preventDefault(); // Prevent default form submission if necessary

      try {
          if (launchButton.textContent === 'Launch') {
              await window.electron.launchGame(game.id);
              launchButton.textContent = 'Stop';
              game.isRunning = true;
          } else {
              await window.electron.stopGame(game.id);
              launchButton.textContent = 'Launch';
              game.isRunning = false;
          }
      } catch (error) {
          console.error('Error managing game:', error);
      }
  });

  gameCard.appendChild(launchButton); // Add button to game card
}

async function loadAndRenderGames() {
  try {
    const games = await window.electron.getGames(); // Fetch games from the backend
    renderGameList(games);
    renderNewGameList(games);
    renderTopPlaytimeGames();
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

  const addGameBtn = document.getElementById('addGameBtn');
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
      const textLogo = document.getElementById('text-logo').value;
      const coverUrl = document.getElementById('cover-url').value;
      const backgroundUrl = document.getElementById('background-url').value;
      const company = document.getElementById('company').value; // Get company field

      const newGame = {
        name: gameName,
        path: gamePath,
        iconUrl,
        textLogo,
        coverUrl,
        backgroundUrl,
        company,  // Include company field
        lastOpened: null,  // Set default values for missing fields if necessary
        totalPlaytime: 0,  // Default totalPlaytime
        isRunning: 0  // Default isRunning value
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
      const textLogo = document.getElementById('edit-text-logo').value;
      const coverUrl = document.getElementById('edit-cover-url').value;
      const backgroundUrl = document.getElementById('edit-background-url').value;

      const updatedGame = {
        id: gameId,
        name: gameName,
        path: gamePath,
        iconUrl,
        textLogo,
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

document.addEventListener('DOMContentLoaded', async () => {
  // Apply fade-in effect on page load
  document.body.classList.add('fade-in');
  // Check if on the game detail page
  if (window.location.pathname.endsWith('game-details.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id'); // Get game ID from the URL

    if (gameId) {
      try {
        const game = await window.electron.getGameById(gameId);

        if (!game) {
          throw new Error('Game details not found.');
        }

        // Set game details in the HTML elements
        document.getElementById('game-logo').src = game.textLogo;

        // Set background image for the page
        const bgOverlayElement = document.getElementById('bgOverlay');
        if (bgOverlayElement) {
          bgOverlayElement.style.backgroundImage = `url('${game.backgroundUrl}')`;
          bgOverlayElement.style.backgroundSize = 'cover';
          bgOverlayElement.style.backgroundPosition = 'center';
          bgOverlayElement.style.backgroundRepeat = 'no-repeat';
        } else {
          console.error('bgOverlay element not found');
        }
        
        // Last Played Info
        document.getElementById('playTime').textContent = "Total Playtime " + `${formatPlaytime(game.totalPlaytime)}`;
        // const infoLastPlayedTitle = document.createElement('p');
        // infoLastPlayedTitle.textContent = 'Last Played:';
        // infoLastPlayedTitle.classList.add('info-title');

        // const infoLastPlayed = document.createElement('p');
        // infoLastPlayed.textContent = `${game.lastOpened ? new Date(game.lastOpened).toLocaleString() : 'Never'}`;
        // infoLastPlayed.classList.add('info-block');

        // // Total Playtime Info
        // const infoPlayTimeTitle = document.createElement('p');
        // infoPlayTimeTitle.textContent = 'Total Playtime:';
        // infoPlayTimeTitle.classList.add('info-title');

        // const infoPlayTime = document.createElement('p');
        // infoPlayTime.classList.add('info-block');

        // Get references to launch and stop buttons
        const launchButton = document.getElementById('launch-game-btn');
        const stopButton = document.getElementById('stop-game-btn');

        // Extract vibrant color from game textLogo and set it as the button background
        if (game.textLogo) {
          const img = new Image();
          img.src = game.textLogo;
          img.crossOrigin = 'Anonymous'; // Ensure CORS compliance
          img.onload = () => {
            Vibrant.from(img).getPalette((err, palette) => {
              if (err) {
                console.error('Error extracting color palette:', err);
                return;
              }

              const vibrantColor = palette.Vibrant ? palette.Vibrant.getRgb() : palette.Muted.getRgb();
              const color1 = `rgb(${vibrantColor.join(',')})`;

              // Apply extracted color to the launch and stop buttons
              if (launchButton) {
                launchButton.style.background = color1;
              }
              if (stopButton) {
                stopButton.style.background = color1;
              }
            });
          };
        }

        // Set button visibility based on game running status
        if (game.isRunning) {
          launchButton.style.display = 'none';
          stopButton.style.display = 'flex';
        } else {
          launchButton.style.display = 'flex';
          stopButton.style.display = 'none';
        }

        // Launch game button functionality
        launchButton.addEventListener('click', async () => {
          try {
            await window.electron.launchGame(gameId); // Launch the game
            launchButton.style.display = 'none';
            stopButton.style.display = 'flex'; // Show stop button after launch
          } catch (error) {
            console.error('Error launching game:', error);
          }
        });

        // Stop game button functionality
        stopButton.addEventListener('click', async () => {
          try {
            await window.electron.stopGame(gameId); // Stop the game
            launchButton.style.display = 'flex';
            stopButton.style.display = 'none'; // Show launch button after stopping
          } catch (error) {
            console.error('Error stopping game:', error);
          }
        });

      } catch (error) {
        console.error('Error loading game details:', error);
      }
    }
  }

  // Back to gallery button functionality
  const backButton = document.getElementById('back-to-gallery');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Optionally add fade-out effect before redirecting to gallery
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = 'games.html';  // Redirect back to the game gallery page
      }, 1000); // Match delay with fade-out CSS transition time
    });
  }
});

function showEditModal(game) {
  // Populate the edit form with the game details
  document.getElementById('edit-game-id').value = game.id;
  document.getElementById('edit-game-name').value = game.name;
  document.getElementById('edit-game-path').value = game.path;
  document.getElementById('edit-icon-url').value = game.iconUrl;
  document.getElementById('edit-text-logo').value = game.textLogo;
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

      // Optional elements for index.html
      const gameContainer = document.getElementById('game-container');
      const overlayImage = document.getElementById('overlay-img');

      // If gameContainer doesn't exist, skip its functionality
      if (gameContainer) {
          gameContainer.innerHTML = ''; // Clear existing content only if gameContainer is present
      }

      games.forEach(game => {
          const gameForm = document.createElement('form');
          gameForm.classList.add('game-form');
          gameForm.action = 'game-details.html'; // Redirect to game-details.html on submit
          gameForm.method = 'GET';

          const gameIdInput = document.createElement('input');
          gameIdInput.type = 'hidden';
          gameIdInput.name = 'id';
          gameIdInput.value = game.id;
          gameForm.appendChild(gameIdInput);

          const gameCard = document.createElement('div');
          gameCard.classList.add('game-card');

          const coverImageContainer = document.createElement('div');
          coverImageContainer.classList.add('game-cover-container');
    
          // Create the absolute positioned cover container (background)
          const coverImageBackgroundContainer = document.createElement('div');
          const coverImageBackground = document.createElement('div');
          const coverImageBackgroundOverlay = document.createElement('div');
          coverImageBackgroundContainer.classList.add('game-cover-background-container');
          coverImageBackground.classList.add('game-cover-background');
          coverImageBackgroundOverlay.classList.add('game-cover-background-overlay');
          if (game.coverUrl) {
              coverImageBackground.style.backgroundImage = `url('${game.coverUrl}')`;
          }
    
          coverImageBackgroundContainer.appendChild(coverImageBackground);
          coverImageBackgroundContainer.appendChild(coverImageBackgroundOverlay);
          gameCard.appendChild(coverImageBackgroundContainer);
    
          // Cover Art
          if (game.coverUrl) {
              const coverImage = document.createElement('img');
              coverImage.src = game.coverUrl;
    
              coverImage.alt = `Cover art for ${game.name}`;
    
              coverImage.classList.add('game-cover');
    
              coverImageContainer.appendChild(coverImage);
          }
    
          // Game Information Container
          const gameInfoContainer = document.createElement('div');
          gameInfoContainer.classList.add('game-info-container');
    
          // Game Name
          const gameName = document.createElement('span');
          if (game.textLogo) {
            gameName.style.backgroundImage = `url('${game.textLogo}')`;
            gameName.classList.add('text-logo-available');
          } else {
            gameName.textContent = game.name;
          }
    
          gameInfoContainer.appendChild(gameName);
    
          // Game Company
          const gameCompany = document.createElement('span');
          gameCompany.textContent = game.company;
          gameInfoContainer.appendChild(gameCompany);
    
          // Append the info container to the game card
          coverImageContainer.appendChild(gameInfoContainer);
          gameCard.appendChild(coverImageContainer);

          // Add the launch button
          addLaunchButton(gameInfoContainer, game);

          const viewDetailsButton = document.createElement('button');
          viewDetailsButton.type = 'submit';
          viewDetailsButton.textContent = ' ';
          viewDetailsButton.classList.add('view-details-button');
          gameCard.appendChild(viewDetailsButton);

          gameForm.appendChild(gameCard);

          if (gameContainer) {
              gameContainer.appendChild(gameForm); // Only append to gameContainer if it exists
          }

          // Intercept form submission to add fade-out effect if overlayImage is present
          gameForm.addEventListener('submit', (e) => {
              e.preventDefault();

              if (overlayImage) {
                  document.body.classList.add('fade-out');
                  setTimeout(() => {
                      gameForm.submit();
                  }, 1000);
              } else {
                  gameForm.submit();
              }
          });
      });
  } catch (error) {
      console.error('Error loading games:', error.message);
  }
}

function formatPlaytime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) {
    return `${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}
