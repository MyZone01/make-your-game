export const player = document.createElement('div')
export const playerPosition = { x: 11, y: 11 }
player.style.gridRowStart = playerPosition.y
player.style.gridColumnStart = playerPosition.x
player.classList.add('player')
let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      // if (lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: -1 }
      playerPosition.x += inputDirection.x
      playerPosition.y += inputDirection.y
      break
    case 'ArrowDown':
      // if (lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: 1 }
      playerPosition.x += inputDirection.x
      playerPosition.y += inputDirection.y
      break
    case 'ArrowLeft':
      // if (lastInputDirection.x !== 0) break
      inputDirection = { x: -1, y: 0 }
      playerPosition.x += inputDirection.x
      playerPosition.y += inputDirection.y
      break
    case 'ArrowRight':
      // if (lastInputDirection.x !== 0) break
      inputDirection = { x: 1, y: 0 }
      playerPosition.x += inputDirection.x
      playerPosition.y += inputDirection.y
      break
  }
})

export function getInputDirection() {
  lastInputDirection = inputDirection
  return inputDirection
}

export function update() {
  const inputDirection = getInputDirection()

  player.style.gridRowStart = playerPosition.y
  player.style.gridColumnStart = playerPosition.x

  // console.log(playerPosition);
}