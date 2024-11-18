class Render {
    constructor(gameInstance) {
        this.gameInstance = gameInstance; // Store reference to the Game instance
    }

    colorMap = {
        "Knife": "card-red",
        "Bottle": "card-blue",
        "Map": "card-green",
        "Treasure": "card-black",
        "Gold": "card-yellow",
        "Pirate Hat": "card-purple"
    }

    renderPlayerHands(players) {
        const playerHandsContainer = document.getElementById('player-hands');
        playerHandsContainer.innerHTML = ''; // Clear any existing content

        players.forEach((player) => {
            const playerHandElement = document.createElement('div');
            playerHandElement.innerHTML = `<h2>Player ${player.playerIndex}'s Hand</h2>`;

            const moveBackElement = document.createElement('div');
            moveBackElement.className = 'card';
            moveBackElement.textContent = "return";
            moveBackElement.addEventListener('click', () => {
                this.gameInstance.moveBack(player); // Call Game method
            });
            playerHandElement.appendChild(moveBackElement);

            player.hand.forEach((card) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.className += ` ${this.colorMap[card]}`;
                cardElement.textContent = card;
                cardElement.addEventListener('click', () => {
                    this.gameInstance.handleCardClick(player, card); // Call Game method
                });
                playerHandElement.appendChild(cardElement);
            });

            playerHandsContainer.appendChild(playerHandElement);
        });
    }

    // Method to setup the game board dynamically in a zigzag pattern
    setupBoard(board) {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        const tilesPerRow = 8;
        let rowIndex = 0;
        let tileIndex = 0;

        while (tileIndex < board.length) {
            if (rowIndex % 4 === 0) {
                // Row 0, 4, 8, etc. (left to right)
                const rowTiles = board.slice(tileIndex, tileIndex + tilesPerRow); // Get the next set of tiles
                this.addRow(gameBoard, rowTiles, false); // Add row in normal order (left to right)
                tileIndex += rowTiles.length;
            } else if (rowIndex % 4 === 1) {
                // Row 1, 5, 9, etc. (right to left with empty tiles)
                const rowTiles = board.slice(tileIndex, tileIndex + 1); // Only 1 actual tile
                this.addRowWithEmptyTiles(gameBoard, rowTiles, true); // Add row in reverse order with empty tiles (right to left)
                tileIndex += rowTiles.length;
            } else if (rowIndex % 4 === 2) {
                // Row 2, 6, 10, etc. (right to left, no empty tiles)
                const rowTiles = board.slice(tileIndex, tileIndex + tilesPerRow); // Get the next set of tiles
                this.addRow(gameBoard, rowTiles, true); // Add row in reverse order (right to left)
                tileIndex += rowTiles.length;
            } else if (rowIndex % 4 === 3) {
                // Row 3, 7, 11, etc. (left to right with empty tiles)
                const rowTiles = board.slice(tileIndex, tileIndex + 1); // Only 1 actual tile
                this.addRowWithEmptyTiles(gameBoard, rowTiles, false); // Add row in normal order with empty tiles (left to right)
                tileIndex += rowTiles.length;
            }
            rowIndex++;
        }
    }

    // Helper method to add a row of tiles to the board
    addRow(parent, rowTiles, reverse) {
        const tilesPerRow = 8; // The desired number of tiles per row
        const missingTilesCount = tilesPerRow - rowTiles.length;

        if (reverse) {
            rowTiles.reverse(); // Reverse if needed (right to left)
            for (let i = 0; i < missingTilesCount; i++) {
                parent.appendChild(this.createEmptyTile());
            }
        }
        rowTiles.forEach((tileContent) => {
            const tile = this.createTile(tileContent.name, tileContent.index);
            parent.appendChild(tile);
        });
        if (!reverse) {
            for (let i = 0; i < missingTilesCount; i++) {
                parent.appendChild(this.createEmptyTile());
            }
        }
    }

    // Helper method to add a row of tiles with empty tiles before or after it (for the zigzag)
    addRowWithEmptyTiles(parent, rowTiles, reverse) {
        const emptyTilesCount = 7; // Create 7 empty tiles for spacing

        if (reverse) {
            for (let i = 0; i < emptyTilesCount; i++) {
                const emptyTile = this.createEmptyTile();
                parent.appendChild(emptyTile);
            }
            console.log(rowTiles)
            const tile = this.createTile(rowTiles[0].name, rowTiles[0].index);
            parent.appendChild(tile);
        } else {
            const tile = this.createTile(rowTiles[0].name, rowTiles[0].index);
            parent.appendChild(tile);
            for (let i = 0; i < emptyTilesCount; i++) {
                const emptyTile = this.createEmptyTile();
                parent.appendChild(emptyTile);
            }
        }
    }

    // Helper method to create a tile
    createTile(content, index) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.className += ` ${this.colorMap[content]}`;
        tile.setAttribute('data-item', index);
        tile.textContent = content;
        return tile;
    }

    // Helper method to create an empty tile for spacing
    createEmptyTile() {
        const emptyTile = document.createElement('div');
        emptyTile.className = 'empty-tile';
        return emptyTile;
    }

    updatePawnPosition(playerIndex, pawnIndex, newPosition) {
        const pawn = document.getElementById(`player${playerIndex}-pawn${pawnIndex}`);
        const newTile = document.querySelector(`[data-item="${newPosition}"]`);
        console.log(newTile)
        if (pawn && newTile) {
            newTile.appendChild(pawn); // Move pawn to new tile
        }
    }

    updateActivePawn(playerIndex, activePawnIndex, numberOfPawns) {
        for (let i = 0; i < numberOfPawns; i++) {
            const pawn = document.getElementById(`player${playerIndex}-pawn${i}`);
            if (i === activePawnIndex) {
                pawn.classList.add('active');
            } else {
                pawn.classList.remove('active');
            }
        }
    }

    renderPlayerPawns(playerIndex, pawns) {
        console.log(pawns)
        pawns.forEach((pawn, pawnIndex) => {
            const tile = document.querySelector(`[data-item="${pawn.position}"]`);
            console.log("tile: ", tile)
            const pawnElement = document.createElement('div');
            pawnElement.className = 'pawn';
            pawnElement.id = `player${playerIndex}-pawn${pawnIndex}`;
            pawnElement.style.backgroundColor = playerIndex === 0 ? '#007bff' : '#ff5733';
            pawnElement.addEventListener('click', () => this.gameInstance.players[playerIndex].setActivePawn(pawnIndex));
            tile.appendChild(pawnElement);
        });
    }

}
