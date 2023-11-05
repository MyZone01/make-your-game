import { isValidMove, randomGridPosition } from "./board.js";

class Enemy {
    constructor({ x, y }) {
        this.x = x;
        this.y = y;
        this.element = null;
    }

    setElement(element) {
        this.element = element;
        this.element.style.gridRow = this.y;
        this.element.style.gridColumn = this.x;
    }

    moveRandomly() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];

        switch (randomDirection) {
            case 'up':
                this.move(0, -1);
                break;
            case 'down':
                this.move(0, 1);
                break;
            case 'left':
                this.move(-1, 0);
                break;
            case 'right':
                this.move(1, 0);
                break;
        }
    }

    move(dx, dy) {
        // console.log("ok");
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (isValidMove(newX - 1, newY - 1)) {
            // Move the enemy in the 2D array
            this.x = newX;
            this.y = newY;

            // Move the enemy in the DOM
            this.element.style.gridRow = this.y;
            this.element.style.gridColumn = this.x;
        }
    }
}

// Create an array to store enemies
export const enemies = [];
const enemiesPositions = [
    { x: 2, y: 5 },
    { x: 20, y: 2 },
    { x: 10, y: 10 },
    { x: 8, y: 12 },
    { x: 2, y: 20 },
];
export let numEnemies = 5;

// Function to create and initialize enemies
export function createEnemies(board) {
    for (let i = 0; i < numEnemies; i++) {
        // Check if position is valid
        let randomPosition = enemiesPositions[i]

        const enemyElement = document.createElement('div');
        enemyElement.innerHTML = i + 1
        enemyElement.classList.add('enemy');
        // You can set enemyElement's initial position styles here

        const enemy = new Enemy(randomPosition);
        enemy.setElement(enemyElement);
        enemyElement.setAttribute('id', `e-${i + 1}`)

        // Append the enemy element to the game board
        board.appendChild(enemyElement);

        enemies.push(enemy);
    }
}

//Function to move each enemies
export function moveEnemies() {
    for (let i = 0; i < numEnemies; i++) {
        const enemy = enemies[i];
        enemy.moveRandomly();
    }
}

export function affectEnemies(x, y) {
    for (let i = 0; i < numEnemies; i++) {
        const enemy = enemies[i];
        if (enemy.x === x && enemy.y === y) {
            enemy.element.remove();
            enemies.splice(i, 1);
            numEnemies--;
        }
    }
}
