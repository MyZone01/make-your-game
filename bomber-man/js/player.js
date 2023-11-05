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
    this.currentBombType = 'super'; // Initial bomb type
    this.bombCount = 0; // Track the number of bombs placed

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
          if (!this.detonateBomb()) this.placeBomb();
          break;
      }
    });
  }

  placeBomb() {
    if (this.bombCount < 3) { // Check if the player can place a bomb
      const bomb = new Bomb(this.position.x, this.position.y, this.getBombRadius());
      this.bombs.push(bomb);
      this.bombCount++;
      if (this.currentBombType === 'manual') {
        bomb.manualBomb = true; // Set the bomb as manual
      } else {
        // Set a timer to explode the bomb after 3 seconds for non-manual bombs
        bomb.explosionTimer = setTimeout(() => {
          bomb.explode();
          this.removeBomb(bomb);
        }, 3000);
      }
    }
  }

  getBombRadius() {
    switch (this.currentBombType) {
      case 'simple':
        return 1;
      case 'super':
        return 3;
      default:
        return 1;
    }
  }

  detonateBomb() {
    for (const bomb of this.bombs) {
      if (bomb.manualBomb && !bomb.explosionTimer) {
        bomb.explode();
        this.removeBomb(bomb);
        return true
      }
    }
  }

  changeBombType(bombType) {
    this.currentBombType = bombType;
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
