class Game {
    constructor() {
        this.createBoard(true);
        this.deck = new Deck();
        this.render = new Render(this);
        this.render.setupBoard(this.board);
        this.players = [new Player(0, this), new Player(1, this)];
        this.render.renderPlayerHands(this.players);
        this.currentPlayerIndex = 0;
        this.createButtons();
        console.log(this.deck)
        console.log(this.board)
        console.log(this.players[0].pawns)
    }

    createButtons() {
        const buttons = document.getElementById('buttons');
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save game';
        saveButton.addEventListener('click', () => {
            this.saveGame();
        });
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load game';
        loadButton.addEventListener('click', () => {
            this.loadGame();
        });
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset game';
        resetButton.addEventListener('click', () => {
            this.resetGame();
        });

        buttons.appendChild(saveButton);
        buttons.appendChild(loadButton);
        buttons.appendChild(resetButton);
    }

    resetGame() {
        this.createBoard(true);
        this.deck = new Deck();
        this.render = new Render(this);
        this.render.setupBoard(this.board);
        this.players = [new Player(0, this), new Player(1, this)];
        this.render.renderPlayerHands(this.players);
        this.currentPlayerIndex = 0;
    }

    saveGame() {
        const gameState = {
            currentPlayerIndex: this.currentPlayerIndex,
            players: this.players.map(player => ({
                playerIndex: player.playerIndex,
                pawnIndex: player.pawnIndex,
                pawns: player.pawns.map(pawn => ({ position: pawn.position, color: pawn.color })),
                hand: player.hand
            })),
            board: this.board,
            deck: {
                cards: this.deck.cards
            }
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
        console.log("Game saved!");
    }

    loadGame() {
        const gameState = JSON.parse(localStorage.getItem('gameState'));
        this.deck.cards = gameState.deck.cards;
        this.board = gameState.board;
        this.players = gameState.players.map(player => {
            const newPlayer = new Player(player.playerIndex, this);
            newPlayer.pawnIndex = player.pawnIndex;
            newPlayer.pawns = player.pawns.map(pawn => new Pawn(player.player, pawn.position));
            newPlayer.hand = player.hand;
            return newPlayer;
        });
        this.currentPlayerIndex = gameState.currentPlayerIndex;
        this.render.setupBoard(this.board);
        this.render.renderPlayerHands(this.players);
        this.render.renderPlayerPawns(0, this.players[0].pawns);
        this.render.renderPlayerPawns(1, this.players[1].pawns);
        this.render.updateActivePawn(0, this.players[0].pawnIndex, this.players[0].numberOfPawns);
        this.render.updateActivePawn(1, this.players[1].pawnIndex, this.players[1].numberOfPawns);
    }

    createBoard(random = false) {
        if (random) {
            const BOARD_SIZE = 30;
            let board = ['Start'];
            for (let i = 0; i < BOARD_SIZE; i++) {
                const randomIndex = Math.floor(Math.random() * CARDS.length);
                board.push(CARDS[randomIndex]);
            }
            board.push('Exit');
            this.board = board.map((item, index) => {
                return { name: item, index: index };
            });

        } else {
            this.board = BOARD_WITH_NUMBERS;
        }
    }
    handleCardClick(player, card) {
        if (this.currentPlayerIndex !== player.playerIndex) {
            console.log(`Player ${player.playerIndex} is not the current player`);
            return;
        }
        console.log(`Player ${player.playerIndex} clicked card: ${card}`);
        const nextPosition = this.board.findIndex(
            (tile, index) => tile.name === card && index > player.pawns[player.pawnIndex].position
        );
        if (nextPosition !== -1) {
            this.movePlayer(player.pawnIndex, nextPosition);
        } else {
            this.movePlayer(player.pawnIndex, this.board.length - 1);
        }
    }

    moveBack(player) {
        if (this.currentPlayerIndex !== player.playerIndex) {
            console.log(`Player ${player.playerIndex} is not the current player`);
            return;
        }
        console.log(`Player ${player.playerIndex} wants to move backwards.`);
        const nextPosition = this.getLastOccupiedPositionBeforeCurrentPawn(player.pawns[player.pawnIndex].position);
        if (nextPosition !== -1) {
            this.movePlayer(player.pawnIndex, nextPosition);
        } else {
            console.log("No more positions to move to.");
        }
    }

    // Move to the next unoccupied item
    movePlayer(pawnIndex, nextPosition) {
        const player = this.players[this.currentPlayerIndex];
        if (player.isValidMove(nextPosition)) {
            player.movePawn(pawnIndex, nextPosition);
            console.log(`Pawn ${pawnIndex} from player ${player.playerIndex} moved to ${nextPosition} (${this.board[nextPosition].name}).`);
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length; // Next player's turn
        }
    }

    // Check if a player has won
    checkWin() {
        for (const player of this.players) {
            if (player.position.filter(pos => pos === this.board.length - 1).length === 6) {
                console.log(`${player.playerIndex} wins!`);
                return true;
            }
        }
        return false;
    }

    countPawnsAtPosition(position) {
        let nPawns =
            this.players[0].pawns.filter(pawn => pawn.position === position).length +
            this.players[1].pawns.filter(pawn => pawn.position === position).length;
        return nPawns;
    }

    getLastOccupiedPositionBeforeCurrentPawn(currentPosition) {
        let lastOccupiedPosition = -1;

        let pawns = this.players[0].pawns.concat(this.players[1].pawns);
        for (let i = 0; i < pawns.length; i++) {
            if (pawns[i].position < currentPosition && pawns[i].position > lastOccupiedPosition) {
                lastOccupiedPosition = pawns[i].position;
                console.log(lastOccupiedPosition);
            }
        }
        return lastOccupiedPosition;
    }
}