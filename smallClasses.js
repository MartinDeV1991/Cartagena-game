class Deck {
    constructor() {
        this.cards = [];
        this.shuffle();
    }

    shuffle() {
        this.cards = [];
        for (let i = 0; i < DECK_SIZE; i++) {
            let card = Math.floor(Math.random() * CARDS.length);
            this.cards.push(CARDS[card]);
        }
    }
}

class Pawn {
    constructor(playerIndex, position = 0) {
        this.position = position;
        this.color = playerIndex === 0 ? '#007bff' : '#ff5733';
    }
}