import { createGameBoard, gameBoard } from './board.js'
import { createEnemies, moveEnemies } from './enemy.js'
import { update as updatePlayer, player } from './player.js'
const SPEED = 5
let lastRenderTime = 0
let gameOver = false

// Call the function to create the game board
createGameBoard()

// Call the function to create and initialize enemies
createEnemies(gameBoard);

gameBoard.appendChild(player)

function gameLoop(currentTime) {
  if (gameOver) {
    if (confirm('You lost. Press ok to restart.')) {
      window.location = '/'
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
  updatePlayer()
  moveEnemies()
  checkDeath()
}

function checkDeath() {
  // Check if player is death
  gameOver = false
}