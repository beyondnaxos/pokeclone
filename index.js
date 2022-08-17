import { collisions } from './data/collisions.js'
import { battleZonesData } from './data/battleZones.js'
import { Sprite, Boundary } from '/classes.js'
import { config } from './data/config.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(collisions)

canvas.width = config.viewWith
// canvas.height = 576
canvas.height = config.viewHeight

const collisionsMap = []
for (let i = 0; i < collisions.length; i += config.mapWidth) {
  collisionsMap.push(collisions.slice(i, config.mapWidth + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += config.mapWidth) {
  battleZonesMap.push(battleZonesData.slice(i, config.mapWidth + i))
}

const boundaries = []

const offset = {
  x: -1400,
  y: -150,
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
  })
})

const battleZones = []
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
  })
})

console.log('battleZones', battleZones)

const image = new Image()
image.src = './img/Naxos_town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
})

const keys = {
  z: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const movables = [background, ...boundaries, foreground, ...battleZones]
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width - 15 >= rectangle2.position.x && // right
    rectangle1.position.x <= rectangle2.position.x - 15 + rectangle2.width && // left
    rectangle1.position.y <= rectangle2.position.y - 25 + rectangle2.height && // up
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y // down
  )
}

const battle = {
  initiated: false,
}

function animate() {
  window.requestAnimationFrame(animate)
  background.draw(c)
  boundaries.forEach((boundary) => {
    boundary.draw(c)
  })
  battleZones.forEach((battleZone) => {
    battleZone.draw(c)
  })
  player.draw(c)
  foreground.draw(c)

  let moving = true
  player.moving = false
  
  if (battle.initiated) return

  if (keys.z.pressed || keys.q.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y))
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        // battle activation rate
        Math.random() < config.activationBattleRate
      ) {
        console.log('activate battle')
        battle.initiated = true
        break
      }
    }
  }


  if (keys.z.pressed && lastKey === 'z') {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
  } else if (keys.q.pressed && lastKey === 'q') {
    player.moving = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
  }

  /******************************************************************************************** */
  //  allow free move
  else if (
    (keys.z.pressed && lastKey === 'q') ||
    (keys.z.pressed && lastKey === 'd') ||
    (keys.z.pressed && lastKey === 's')
  ) {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
  } else if (
    (keys.q.pressed && lastKey === 'z') ||
    (keys.q.pressed && lastKey === 's') ||
    (keys.q.pressed && lastKey === 'd')
  ) {
    player.moving = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
  } else if (
    (keys.s.pressed && lastKey === 'z') ||
    (keys.s.pressed && lastKey === 'q') ||
    (keys.s.pressed && lastKey === 'd')
  ) {
    player.moving = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
  } else if (
    (keys.d.pressed && lastKey === 'z') ||
    (keys.d.pressed && lastKey === 'q') ||
    (keys.d.pressed && lastKey === 's')
  ) {
    player.moving = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('collision')
        moving = false
        break
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
  }
  /******************************************************************************************* */
}

animate()

let lastKey = ''

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'z':
      keys.z.pressed = true
      lastKey = 'z'
      break
    case 'q':
      keys.q.pressed = true
      lastKey = 'q'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
  // console.log(keys)
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'z':
      keys.z.pressed = false
      break
    case 'q':
      keys.q.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
  // console.log(keys)
})
