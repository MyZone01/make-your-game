import { isValidMove, board } from "./board.js";
import Bomb from "./bomb.js";

export class Player {
  constructor() {
    this.element = document.createElement("div");
    this.position = { x: 2, y: 2 };
    this.element.style.gridRowStart = this.position.y;
    this.element.style.gridColumnStart = this.position.x;
    this.element.classList.add("player");
    this.inputDirection = { x: 0, y: 0 };
    this.dead = false;
    this.addBomb = false;
    this.pause = false;

    this.bombs = [];
    this.currentBombType = "simple"; // Initial bomb type
    this.bombAmount = 1; // Track the number of bombs he can place at time
    this.availableBombs = this.bombAmount;

    window.addEventListener("keydown", (e) => {
      if (this.pause) return;

      switch (e.key) {
        case "ArrowUp":
          this.inputDirection = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          this.inputDirection = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          this.inputDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          this.inputDirection = { x: 1, y: 0 };
          break;
        case " ":
          this.addBomb = true;
          break;
      }
    });
  }

  placeBomb() {
    this.addBomb = false;
    if (this.availableBombs > 0) {
      // Check if the player can place a bomb

      const bomb = new Bomb(this.position.x, this.position.y, this.getBombRadius());
      board[this.position.y - 1][this.position.x - 1] = "B";
      this.bombs.push(bomb);
      this.availableBombs--;
      if (this.currentBombType === "manual") {
        bomb.manualBomb = true; // Set the bomb as manual
      } else {
        // Set a timer to explode the bomb after 3 seconds for non-manual bombs
        bomb.explosionTimer = setTimeout(() => {
          bomb.explode();
          this.removeBomb(bomb);
        }, bomb.remainingTime);
      }
    }
  }

  toggleBombTime() {
    if (this.pause) {
      for (const bomb of this.bombs) {
        if (bomb.explosionTimer) {
          bomb.remainingTime -= Date.now() - bomb.startTime;
          clearTimeout(bomb.explosionTimer);
          bomb.explosionTimer = null;
        }
      }
    } else {
      for (const bomb of this.bombs) {
        if (!bomb.explosionTimer) {
          bomb.startTime = Date.now();
          bomb.explosionTimer = setTimeout(() => {
            bomb.explode();
            this.removeBomb(bomb);
          }, bomb.remainingTime);
        }
      }
    }
  }

  getBombRadius() {
    switch (this.currentBombType) {
      case "simple":
        return 1;
      case "super":
        return 3;
      default:
        return 1;
    }
  }

  detonateBomb() {
    this.addBomb = false;
    for (const bomb of this.bombs) {
      if (bomb.manualBomb && !bomb.explosionTimer) {
        bomb.explode();
        this.removeBomb(bomb);
        return true;
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
      this.availableBombs++;
    }
  }

  update() {
    if (this.addBomb) {
      if (!this.detonateBomb()) this.placeBomb();
    }
    if (this.inputDirection.x === 0 && this.inputDirection.y === 0) return;

    const newPositionX = this.position.x + this.inputDirection.x;
    const newPositionY = this.position.y + this.inputDirection.y;
    
    if (isValidMove(newPositionX - 1, newPositionY - 1)) {
      this.position.x = newPositionX;
      this.position.y = newPositionY;

        this.element.style.gridRowStart = this.position.y;
        this.element.style.gridColumnStart = this.position.x;      
    }

    this.inputDirection = { x: 0, y: 0 };
  }
}

export const player = new Player();

export function affectPlayer(x, y) {
  if (player.position.x === x && player.position.y === y) {
    player.dead = true;
    player.element.remove();
  }
}
