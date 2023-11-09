import { createGameBoard, gameBoard, board } from "./board.js";
import Bomb from "./bomb.js";
import { createEnemies, enemies, moveEnemies } from "./enemy.js";
import { HUDManager } from "./hud.js";
import { KeyBoardHandler } from "./key.js";
import { Player } from "./player.js";
import { PowerUp } from './powerup.js';
import { TimerManager } from "./timer.js";

const SPEED = 20;

class BomberManGame {
  constructor() {
    this.player = new Player();

    this.lastRenderTime = 0;
    this.gameOver = false;
    this.gamePause = false;

    this.addBomb = false;

    this.bombs = [];
    this.gameOverMessage = "";
    this.currentBombType = "simple"; // Initial bomb type
    this.bombAmount = 1; // Track the number of bombs he can place at time
    this.availableBombs = this.bombAmount;
  }

  run() {
    createGameBoard();
    createEnemies(gameBoard);
    gameBoard.appendChild(this.player.element);

    this.keyBoardHandler = new KeyBoardHandler(this.onControlPress.bind(this), this.onGamePause.bind(this));
    this.hUDManager = new HUDManager(this.onGamePause.bind(this));
    this.timerManager = new TimerManager(this.hUDManager);
    this.startGameLoop();
  }

  onGamePause() {
    this.gamePause = !this.gamePause;
    this.timerManager.togglePauseResume(this.gamePause);
    this.hUDManager.togglePauseResume(this.gamePause);
  }

  onControlPress(e) {
    if (this.gamePause) return;

    // Handle player controls
    switch (e.key) {
      case "ArrowUp":
        if (this.player.inputDirection.x !== 0 || this.player.inputDirection.y !== 0) return;
        this.player.inputDirection = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (this.player.inputDirection.x !== 0 || this.player.inputDirection.y !== 0) return;
        this.player.inputDirection = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (this.player.inputDirection.x !== 0 || this.player.inputDirection.y !== 0) return;
        this.player.inputDirection = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (this.player.inputDirection.x !== 0 || this.player.inputDirection.y !== 0) return;
        this.player.inputDirection = { x: 1, y: 0 };
        break;
      case " ":
        this.addBomb = true;
        break;
    }
  }

  startGameLoop() {
    const gameLoop = (currentTime) => {
      if (this.gameOver) {
        clearInterval(this.timerManager.timerInterval);
        if (confirm(this.gameOverMessage)) {
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

  placeBomb() {
    this.addBomb = false;
    if (this.availableBombs > 0) {
      // Check if the player can place a bomb

      const bomb = new Bomb(this.player.position.x, this.player.position.y, this.getBombRadius());
      board[this.player.position.y - 1][this.player.position.x - 1] = "B";
      this.bombs.push(bomb);
      gameBoard.appendChild(bomb.element);
      this.availableBombs--;
      this.hUDManager.updateBombsCount(this.availableBombs);
      if (this.currentBombType === "manual") {
        bomb.manualBomb = true; // Set the bomb as manual
      } else {
        // Set a timer to explode the bomb after 3 seconds for non-manual bombs
        this.timerManager.addTimer(bomb.id, () => {
          this.hUDManager.updateScore(bomb.explode());
          this.removeBomb(bomb);
        }, 3000);
        this.timerManager.startTimer(bomb.id);
      }
    }
  }

  increaseBombCount() {
    this.availableBombs++;
    this.hUDManager.updateBombsCount(this.availableBombs);
    this.bombAmount++;
  }

  resetBombCount() {
    this.bombAmount = 1
    this.hUDManager.updateBombsCount(this.availableBombs);
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
      if (bomb.manualBomb) {
        this.hUDManager.updateScore(bomb.explode());
        this.removeBomb(bomb);
        return true;
      }
    }
  }

  changeBombType(bombType) {
    this.hUDManager.updateBombType(bombType.toUpperCase());
    this.currentBombType = bombType;
  }

  removeBomb(bomb) {
    setTimeout(() => {
      const index = this.bombs.indexOf(bomb);
      if (index !== -1) {
        this.bombs.splice(index, 1);
        board[bomb.y - 1][bomb.x - 1] = "V";
        gameBoard.removeChild(bomb.element);
        this.availableBombs = this.bombAmount;
        this.hUDManager.updateBombsCount(this.availableBombs);
      }
    }, 255);
  }

  update() {
    if (this.addBomb) {
      if (!this.detonateBomb()) this.placeBomb();
    }
    this.player.update();
    moveEnemies();
    this.checkPowerUpCollision();
    this.checkVictory();
    this.checkDeath();
  }

  checkDeath() {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.x === this.player.position.x && enemy.y === this.player.position.y) {
        this.gameOver = true;
        this.gameOverMessage = `Kill by enemy\nYour score: ${this.hUDManager.score}\n`
      }
    }
    if (this.hUDManager.timer === 0) {
      this.gameOver = true
      this.gameOverMessage = `Time Over\nYour score: ${this.hUDManager.score}\n`
    }
  }

  checkVictory() {
    this.gameOver = enemies.length === 0;
    if (this.gameOver) {
      this.gameOverMessage = `Victory\nYour score: ${this.hUDManager.score}\n`
    }
  }

  checkPowerUpCollision() {
    const playerX = this.player.position.x;
    const playerY = this.player.position.y;
    if (board[playerY - 1][playerX - 1] === 'V' || board[playerY - 1][playerX - 1] === 'B') return;

    const powerUp = new PowerUp(board[playerY - 1][playerX - 1]);
    powerUp.applyEffect(this);
    board[playerY - 1][playerX - 1] = 'V';
    const cell = document.getElementById(`c-${playerY}-${playerX}`);
    if (cell) {
      cell.remove();
    }
  }
}

const game = new BomberManGame();
game.run();

export function affectPlayer(x, y) {
  if (game.player.position.x === x && game.player.position.y === y) {
    game.player.element.style.animation = "explode .25s ease-in-out forwards";
    setTimeout(() => {
      game.player.element.remove();
      game.gameOver = true;
      game.gameOverMessage = `Kill by bomb\nYour score: ${game.hUDManager.score}\n`
    }, 255);
  }
}
