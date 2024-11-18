class Player {
    constructor(playerIndex, game) {
        this.game = game;
        this.playerIndex = playerIndex;
        this.pawnIndex = 0;
        this.numberOfPawns = 6; // Each player has 6 pawns
        this.pawns = []; // Array to track pawns
        this.setupPawns();
        this.hand = [];
        for (let i = 0; i < 6; i++) {
            this.drawCard();
        }
    }

    drawCard() {
        if (this.game.deck.cards.length === 0) {
            console.log('No cards left in deck!');
            return;
        }
        const card = this.game.deck.cards.pop();
        this.hand.push(card);
    }

    // Move a pawn to a new position
    movePawn(pawnIndex, newPosition) {
        this.pawns[pawnIndex].position = newPosition;
        this.game.render.updatePawnPosition(this.playerIndex, pawnIndex, newPosition); // Call Render class to update DOM
    }

    isValidMove(newPosition) {
        const pawn = this.pawns[this.pawnIndex];
        if (newPosition < pawn.position &&
            (this.game.countPawnsAtPosition(newPosition) === 0 || this.game.countPawnsAtPosition(newPosition) > 2)) {
            console.log('Invalid move!');
            return false;
        }
        if (this.game.countPawnsAtPosition(newPosition) > 2) {
            console.log('Invalid move!');
            return false;
        }
        return true;
    }

    // Method to setup the board dynamically
    setupPawns() {
        for (let i = 0; i < this.numberOfPawns; i++) {
            this.pawns.push(new Pawn());
        }

        this.game.render.renderPlayerPawns(this.playerIndex, this.pawns); // Call Render to handle DOM setup
        this.setActivePawn(0);
    }

    setActivePawn(pawnIndex) {
        console.log(`Pawn ${pawnIndex} clicked by player ${this.playerIndex}`);
        this.pawnIndex = pawnIndex;
        this.game.render.updateActivePawn(this.playerIndex, this.pawnIndex, this.numberOfPawns); // Call Render to update DOM
    }
}