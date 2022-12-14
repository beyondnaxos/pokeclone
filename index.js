import { collisions } from './data/collisions.js'
import { battleZonesData } from './data/battleZones.js'
import { Sprite, Boundary } from '/classes.js'
import { villagerMapData } from './data/villager.js'
import { attacks } from './data/attacks.js'
import { config } from './data/config.js'
import { animateBattle, initBattle } from './battleScene.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(gsap)

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

const villagersMap = []
for (let i = 0; i < villagerMapData.length; i += config.mapWidth) {
  villagersMap.push(villagerMapData.slice(i, config.mapWidth + i))
}
console.log(villagersMap)

const boundaries = []

const offset = {
  x: config.playerOffset.x,
  y: config.playerOffset.y,
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

const villagers = []
const villagerImg = new Image()
villagerImg.src = './img/villager.png'

villagersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1026) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      )
      villagers.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
          image: villagerImg,
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 3,
          animate: true,
        })
      )
    }
  })
})

console.log(villagers)
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
    hold: config.playerAnimationSpeed,
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

const movables = [
  background,
  ...boundaries,
  foreground,
  ...battleZones,
  ...villagers,
]

const renderables = [
  background,
  ...boundaries,
  ...battleZones,
  ...villagers,
  player,
  foreground,
]

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x && // right
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width && // left
    rectangle1.position.y <= rectangle2.position.y - 25 + rectangle2.height && // up
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y // down
  )
}

export let battle = {
  initiated: false,
}

export function animate() {
  const animationId = window.requestAnimationFrame(animate)
  // console.log('animationId', animationId)

  renderables.forEach((renderable) => {
    renderable.draw(c)
  })

  let moving = true
  player.animate = false

  // console.log(animationId)
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

        // deactivate current animation loop
        window.cancelAnimationFrame(animationId)
        audio.Map.stop()
        audio.initBattle.play()
        // wait initBattle.play in order to play next audio
        setTimeout(() => {
          audio.initBattle.stop()
          audio.battle.play()
        }, 2820)
        // audio.battle.play()
        battle.initiated = true

        gsap.to('#overlappingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to('#overlappingDiv', {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                initBattle()
                animateBattle()
                gsap.to('#overlappingDiv', {
                  opacity: 0,
                  duration: 0.4,
                })
              },
            })
          },
        })
        break
      }
    }
  }

  if (keys.z.pressed && lastKey === 'z') {
    player.animate = true
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
    player.animate = true
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
    player.animate = true
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
    player.animate = true
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
    player.animate = true
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
    player.animate = true
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
    player.animate = true
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
    player.animate = true
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
// disabled for dev battle
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

let clicked = false
// addEventListener('load', (e) => {
//   if (!clicked) {
//     audio.Map.play()
//     clicked = true
//   }
// })
addEventListener('click', (e) => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})
