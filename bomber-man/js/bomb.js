import { destroyWall, gameBoard } from "./board.js";
import { affectEnemies } from "./enemy.js";

export default class Bomb {
    constructor(x, y, explosionRadius) {
        this.x = x;
        this.y = y;
        this.explosionRadius = explosionRadius;
        this.explosionTimer = null;
        this.element = document.createElement('div');
        this.element.classList.add('bomb');
        this.element.style.gridRowStart = this.y;
        this.element.style.gridColumnStart = this.x;
        gameBoard.appendChild(this.element);
        this.manualBomb = false;
    }

    explode() {
        this.element.classList.add('explosion');
        for (let i = 1; i <= this.explosionRadius; i++) {
            this.explodeInDirection(this.x, this.y - i); // Up
            this.explodeInDirection(this.x, this.y + i); // Down
            this.explodeInDirection(this.x - i, this.y); // Left
            this.explodeInDirection(this.x + i, this.y); // Right
        }
        gameBoard.removeChild(this.element);
    }

    explodeInDirection(x, y) {
        destroyWall(x - 1, y - 1); // Destroy a wall
        affectEnemies(x, y);
        // affectPlayer(x, y);
    }
}
