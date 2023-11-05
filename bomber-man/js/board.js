export const gameBoard = document.getElementById('game-board')
const GRID_SIZE = 21

// Define the game board as a 2D array
export const board = [
    // 'V' for void cell, 'B' for indestructible block, 'W' for destructible wall
    ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    ['B', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'B'],
    ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'W', 'V', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
    ['B', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'B'],
    ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'W', 'V', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'V', 'W', 'B'],
    ['B', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'B', 'W', 'V', 'W', 'W', 'W', 'W', 'W', 'V', 'W', 'B', 'W', 'B'],
    ['B', 'W', 'B', 'W', 'B', 'W', 'V', 'W', 'W', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'W', 'W', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'B'],
    ['B', 'W', 'B', 'W', 'B', 'W', 'W', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'V', 'W', 'B', 'W', 'W', 'W', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'B'],
    ['B', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'B'],
    ['B', 'V', 'B', 'V', 'B', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'B'],
    ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'W', 'W', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
    ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'V', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'V', 'V', 'B'],
    ['B', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B', 'V', 'B'],
    ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
];


export function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1
    }
}

export function outsideGrid(position) {
    return (
        position.x < 1 || position.x > GRID_SIZE ||
        position.y < 1 || position.y > GRID_SIZE
    )
}

export function isValidMove(x, y) {
    const cellValue = board[y][x];
    return cellValue === 'V';
}

export function createGameBoard() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (board[i][j] === 'V') continue;

            const cell = document.createElement('div');

            if (board[i][j] === 'B') {
                cell.classList.add('block');
            } else if (board[i][j] === 'W') {
                cell.classList.add('wall');
            }

            cell.setAttribute('id', `c-${i + 1}-${j + 1}`)

            gameBoard.appendChild(cell);

            cell.style.gridRowStart = i + 1
            cell.style.gridColumnStart = j + 1
        }
    }
}