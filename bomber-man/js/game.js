import { update as updatePlayer, player, playerPosition } from './player.js'
const GRID_SIZE = 21
const SPEED = 10
let lastRenderTime = 0
let gameOver = false
const gameBoard = document.getElementById('game-board')
console.log(player);
gameBoard.appendChild(player);
console.log(gameBoard.childNodes);

export function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1
  }
}

export function outsideGrid(position) {
  return (
    position.x < 1 || position.x > GRID_SIZE ||
    position.y < 1 || position.y > GRID_SIZE
  )
} 


function main(currentTime) {
  if (gameOver) {
    if (confirm('You lost. Press ok to restart.')) {
      window.location = '/'
    }
    return
  }


  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / SPEED) return

  lastRenderTime = currentTime

  update()
}

window.requestAnimationFrame(main)

function update() {
  updatePlayer()
  checkDeath()
}

function checkDeath() {
  // Check if player is death
  gameOver = false
}