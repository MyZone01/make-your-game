import { isValidMove } from "./board.js";
import Bomb from "./bomb.js";

export class Player {
  constructor() {
    this.element = document.createElement('div');
    this.position = { x: 2, y: 2 };
    this.element.style.gridRowStart = this.position.y;
    this.element.style.gridColumnStart = this.position.x;
    this.element.classList.add('player');
    this.inputDirection = { x: 0, y: 0 };

    this.bombs = [];
    this.bombCount = 0;

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.inputDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          this.inputDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          this.inputDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          this.inputDirection = { x: 1, y: 0 };
          break;
        case ' ':
          this.placeBomb();
          break;
      }
    });
  }

  placeBomb() {
    if (this.bombCount < 3) {
      const bomb = new Bomb(this.position.x, this.position.y);
      this.bombs.push(bomb);
      this.bombCount++;
      bomb.explosionTimer = setTimeout(() => {
        bomb.explode();
        this.removeBomb(bomb);
      }, 3000);
    }
  }

  removeBomb(bomb) {
    const index = this.bombs.indexOf(bomb);
    if (index !== -1) {
      this.bombs.splice(index, 1);
      this.bombCount--;
    }
  }

  update() {
    if (this.inputDirection.x === 0 && this.inputDirection.y === 0) return;

    const newPositionX = this.position.x + this.inputDirection.x;
    const newPositionY = this.position.y + this.inputDirection.y;
    this.inputDirection = { x: 0, y: 0 };

    if (isValidMove(newPositionX - 1, newPositionY - 1)) {
      this.position.x = newPositionX;
      this.position.y = newPositionY;

      this.element.style.gridRowStart = this.position.y;
      this.element.style.gridColumnStart = this.position.x;
    }
  }
}
