import { isValidMove } from "./board.js";

export class Player {
  constructor() {
    this.element = document.createElement('div');
    this.position = { x: 2, y: 2 };
    this.element.style.gridRowStart = this.position.y;
    this.element.style.gridColumnStart = this.position.x;
    this.element.classList.add('player');
    this.inputDirection = { x: 0, y: 0 };

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
          this.inputDirection = { x: 1, y: 0 };
          break;
      }
    });
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
