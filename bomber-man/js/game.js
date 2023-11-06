import { createGameBoard, gameBoard, board } from "./board.js";
import { createEnemies, enemies, moveEnemies } from "./enemy.js";
import { player } from "./player.js";
import { PowerUp } from './powerup.js'
import { timerManager } from "./timer.js";

const SPEED = 20;
let lastRenderTime = 0;
let gameOver = false;
let gamePause = false;

// Call the function to create the game board
createGameBoard();

// Call the function to create and initialize enemies
createEnemies(gameBoard);

// Create the player
gameBoard.appendChild(player.element);

function gameLoop(currentTime) {
  if (gameOver) {
    if (confirm("You lost. Press ok to restart.")) {
      window.location = "/bomber-man/";
    }
    return;
  }

  window.requestAnimationFrame(gameLoop);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / SPEED) return;

  lastRenderTime = currentTime;
  if (!gamePause) {
    update();
  }
}

window.requestAnimationFrame(gameLoop);

function update() {
  player.update()
  moveEnemies()
  checkDeath()
  checkPowerUpCollision()
}

function checkDeath() {
  // Check if player is death
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.x === player.position.x && enemy.y === player.position.y) {
      gameOver = true;
    }
  }
  if (player.dead) {
    gameOver = true;
  }
  // gameOver = false;
}

window.addEventListener("keydown", (e) => {
  if (e.key === "p") {
    gamePause = !gamePause;
    player.pause = gamePause;
    timerManager.togglePauseResume(gamePause)
  }
});

function checkPowerUpCollision() {
  const playerX = player.position.x;
  const playerY = player.position.y;
  if (board[playerY - 1][playerX - 1] === 'V' || board[playerY - 1][playerX - 1] === 'B') return

  // Apply the power-up's effect to the player
  const powerUp = new PowerUp(board[playerY - 1][playerX - 1]);
  powerUp.applyEffect(player);
  board[playerY - 1][playerX - 1] = 'V';
  const cell = document.getElementById(`c-${playerY}-${playerX}`);
  if (cell) {
    cell.remove()
  }
}
