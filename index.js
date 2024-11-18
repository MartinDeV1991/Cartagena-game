const CARDS = ['Pirate Hat', 'Knife', 'Bottle', 'Map', 'Treasure', 'Gold'];
const DECK_SIZE = 50;
const BOARD = ['Start', 'Pirate Hat', 'Knife', 'Bottle', 'Map', 'Treasure', 'Gold', 'Pirate Hat', 'Knife',
    'Pirate Hat', 'Knife', 'Bottle', 'Map', 'Treasure', 'Gold', 'Pirate Hat', 'Knife',
    'Pirate Hat', 'Knife', 'Bottle', 'Map', 'Treasure', 'Gold', 'Pirate Hat', 'Knife', 'Exit'];

const BOARD_WITH_NUMBERS = BOARD.map((item, index) => {
    return { name: item, index: index };
});

const game = new Game();

