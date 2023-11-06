import { isValidMove, randomGridPosition } from "./board.js";

class Enemy {
    constructor({ x, y }, index) {
        this.x = x;
        this.y = y;
        this.wait = 5;
        this.element = null;
        this.index = index; // Store the enemy index
    }

    setElement(element) {
        this.element = element;
        this.element.style.gridRow = this.y;
        this.element.style.gridColumn = this.x;
    }

    moveRandomly() {
        this.wait--;
        if (this.wait === 0) {
            this.wait = 5;
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
    }

    move(dx, dy) {
        // console.log("ok");
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (isValidMove(newX - 1, newY - 1)) {
            // Move the enemy in the 2D array
            this.x = newX;
            this.y = newY;

            // Update the CSS variables for translation based on the enemy's position
            this.element.style.setProperty(`--translate-${this.index}-x`, `${this.element.clientWidth * dx}px`);
            this.element.style.setProperty(`--translate-${this.index}-y`, `${this.element.clientHeight * dy}px`);

            this.element.style.animationName = "moveEnemy" + this.index;

            this.element.addEventListener('animationend', () => {
                this.element.style.gridRow = this.y;
                this.element.style.gridColumn = this.x;
                this.element.style.animationName = "none";
            }, { once: true });

            // Move the enemy in the DOM
        }
    }
}

// Create an array to store enemies
export const enemies = [];
const enemiesPositions = [
    { x: 6, y: 4 },
    { x: 14, y: 2 },
    { x: 4, y: 10 },
    { x: 7, y: 7 },
    { x: 8, y: 12 },
    { x: 15, y: 15 },
];
export let numEnemies = 6;

// Function to create and initialize enemies
export function createEnemies(board) {
    for (let i = 0; i < numEnemies; i++) {
        // Check if position is valid
        let randomPosition = enemiesPositions[i]

        const enemyElement = document.createElement('div');
        enemyElement.innerHTML = i + 1
        enemyElement.classList.add('enemy');
        // You can set enemyElement's initial position styles here

        const enemy = new Enemy(randomPosition, i);
        enemy.setElement(enemyElement);
        enemyElement.setAttribute('id', `e-${i + 1}`);

        const keyframes = `@keyframes moveEnemy${i} {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(var(--translate-${i}-x), var(--translate-${i}-y));
            }
        }`;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);

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
