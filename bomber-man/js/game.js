import { createGameBoard, gameBoard } from './board.js'
import { createEnemies, enemies, moveEnemies } from './enemy.js'
import { player } from './player.js'
const SPEED = 5
let lastRenderTime = 0
let gameOver = false

// Call the function to create the game board
createGameBoard()

// Call the function to create and initialize enemies
createEnemies(gameBoard);

// Create the player
gameBoard.appendChild(player.element)

function gameLoop(currentTime) {
  if (gameOver) {
    if (confirm('You lost. Press ok to restart.')) {
      window.location = '/bomber-man/'
    }
    return
  }


  window.requestAnimationFrame(gameLoop)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / SPEED) return

  lastRenderTime = currentTime

  update()
}

window.requestAnimationFrame(gameLoop)

function update() {
  player.update()
  moveEnemies()
  checkDeath()
}

function checkDeath() {
  // Check if player is death
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.x === player.position.x && enemy.y === player.position.y) {
      gameOver = true
    }
  }
  if (player.dead) {
    gameOver = true
  }
  gameOver = false
}