const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
// canvas.height = 576
canvas.height = 800

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './img/Naxos_town.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position
    this.image = image
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

const background = new Sprite({
  position: {
    x: -1553,
    y: -130,
  },
  image: image,
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

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()
  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  )
  if (keys.z.pressed && lastKey === 'z') background.position.y += 3
  else if (keys.q.pressed && lastKey === 'q') background.position.x += 3
  else if (keys.s.pressed && lastKey === 's') background.position.y -= 3
  else if (keys.d.pressed && lastKey === 'd') background.position.x -= 3
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
  console.log(keys)
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
  console.log(keys)
})
