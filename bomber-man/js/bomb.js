import { destroyWall, gameBoard } from "./board.js";
import { affectEnemies } from "./enemy.js";

export default class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.explosionTimer = null;
        this.element = document.createElement('div');
        this.element.classList.add('bomb');
        this.element.style.gridRowStart = this.y;
        this.element.style.gridColumnStart = this.x;
        gameBoard.appendChild(this.element);
    }

    explode() {
        this.element.classList.add('explosion');
        this.explodeInDirection(this.x, this.y - 1); // Up
        this.explodeInDirection(this.x, this.y + 1); // Down
        this.explodeInDirection(this.x - 1, this.y); // Left
        this.explodeInDirection(this.x + 1, this.y); // Right
        gameBoard.removeChild(this.element);
    }

    explodeInDirection(x, y) {
        destroyWall(x - 1, y - 1); // Destroy a wall
        affectEnemies(x, y);
        // affectPlayer(x, y);
    }
}
