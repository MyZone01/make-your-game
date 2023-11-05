import { board, gameBoard } from './board.js'
import { update as updatePlayer, player, playerPosition } from './player.js'
const GRID_SIZE = 21
const SPEED = 10
let lastRenderTime = 0
let gameOver = false

// Function to create the game board from the 2D array
function createGameBoard() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 'V') continue;

      const cell = document.createElement('div');

      if (board[i][j] === 'B') {
        cell.classList.add('block');
      } else if (board[i][j] === 'W') {
        cell.classList.add('wall');
      }

      cell.setAttribute('id', `c-${i+1}-${j+1}`)

      gameBoard.appendChild(cell);

      cell.style.gridRowStart = i + 1
      cell.style.gridColumnStart = j + 1
    }
  }
  gameBoard.appendChild(player)
}

// Call the function to create the game board
createGameBoard();

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