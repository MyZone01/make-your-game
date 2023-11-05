import { isValidMove } from "./board.js"

export const player = document.createElement('div')
export const playerPosition = { x: 2, y: 2 }
player.style.gridRowStart = playerPosition.y
player.style.gridColumnStart = playerPosition.x
player.classList.add('player')
let inputDirection = { x: 0, y: 0 }

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      inputDirection = { x: 0, y: -1 }
      break
    case 'ArrowDown':
      inputDirection = { x: 0, y: 1 }
      break
    case 'ArrowLeft':
      inputDirection = { x: -1, y: 0 }
      break
    case 'ArrowRight':
      inputDirection = { x: 1, y: 0 }
      break
  }
})

export function update() {
  if (inputDirection.x === 0 && inputDirection.y === 0) return

  const newPositionX = playerPosition.x + inputDirection.x
  const newPositionY = playerPosition.y + inputDirection.y
  inputDirection = { x: 0, y: 0 }

  if (isValidMove(newPositionX - 1, newPositionY - 1)) {
    playerPosition.x = newPositionX
    playerPosition.y = newPositionY

    player.style.gridRowStart = playerPosition.y
    player.style.gridColumnStart = playerPosition.x

  }
  // else {
  //   console.log(`c-${newPositionY}-${newPositionX}`);
  //   console.log(document.getElementById(`c-${newPositionY}-${newPositionX}`));
  // }
}