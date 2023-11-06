import { createGameBoard, gameBoard, board } from "./board.js";
import { createEnemies, enemies, moveEnemies } from "./enemy.js";
import { player } from "./player.js";
import { PowerUp } from './powerup.js';
import { timerManager } from "./timer.js";

const SPEED = 20;

class BomberManGame {
  constructor() {
    this.lastRenderTime = 0;
    this.gameOver = false;
    this.gamePause = false;
  }

  run() {
    createGameBoard();
    createEnemies(gameBoard);
    gameBoard.appendChild(player.element);

    this.startGameLoop();
    this.addEventListeners();
  }

  startGameLoop() {
    const gameLoop = (currentTime) => {
      if (this.gameOver) {
        if (confirm("You lost. Press ok to restart.")) {
          window.location = "/bomber-man/";
        }
        return;
      }

      window.requestAnimationFrame(gameLoop);
      const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
      if (secondsSinceLastRender < 1 / SPEED) return;

      this.lastRenderTime = currentTime;
      if (!this.gamePause) {
        this.update();
      }
    };

    window.requestAnimationFrame(gameLoop);
  }

  update() {
    player.update();
    moveEnemies();
    this.checkDeath();
    this.checkPowerUpCollision();
  }

  checkDeath() {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.x === player.position.x && enemy.y === player.position.y) {
        this.gameOver = true;
      }
    }
    if (player.dead) {
      this.gameOver = true;
    }
  }

  addEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "p") {
        this.gamePause = !this.gamePause;
        player.pause = this.gamePause;
        timerManager.togglePauseResume(this.gamePause);
      }
    });
  }

  checkPowerUpCollision() {
    const playerX = player.position.x;
    const playerY = player.position.y;
    if (board[playerY - 1][playerX - 1] === 'V' || board[playerY - 1][playerX - 1] === 'B') return;

    const powerUp = new PowerUp(board[playerY - 1][playerX - 1]);
    powerUp.applyEffect(player);
    board[playerY - 1][playerX - 1] = 'V';
    const cell = document.getElementById(`c-${playerY}-${playerX}`);
    if (cell) {
      cell.remove();
    }
  }
}

const game = new BomberManGame();
game.run();
