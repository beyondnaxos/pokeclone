import { Sprite } from '/classes.js'
import { attacks } from './data/attacks.js'
import { config } from './data/config.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
})

const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'

const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: config.adversMonsterAnimationSpeed,
  },
  animate: true,
  isEnemy: true,
  name: 'Draggle',
})

const embyImage = new Image()
embyImage.src = './img/embySprite.png'

const emby = new Sprite({
  position: {
    x: 280,
    y: 325,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: config.myMonsterAnimationSpeed,
  },
  animate: true,
  name: 'Emby',
})

const renderedSprites = [draggle, emby]

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  battleBackground.draw(c)

  renderedSprites.forEach((sprite) => {
    sprite.draw(c)
  })
}

// animate()
animateBattle()
const animeLetters = () => {
  let textWrapper = document.querySelector('.ml11 .letters')
  textWrapper.innerHTML = textWrapper.textContent.replace(
    /([^\x00-\x80]|\w)/g,
    "<span class='letter'>$&</span>"
  )

  anime
    .timeline({ loop: false })
    .add({
      targets: '.ml11 .line',
      scaleY: [0, 1],
      opacity: [0.5, 1],
      easing: 'easeOutExpo',
      duration: 700,
    })
    .add({
      targets: '.ml11 .line',
      translateX: [
        0,
        document.querySelector('.ml11 .letters').getBoundingClientRect().width +
          10,
      ],
      easing: 'easeOutExpo',
      duration: 700,
      delay: 100,
    })
    .add({
      targets: '.ml11 .letter',
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 600,
      offset: '-=775',
      delay: (el, i) => 34 * (i + 1),
    })
    .add({
      targets: '.ml11',
      opacity: 1,
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 1000,
    })
}

const queue = []

// our event listeners for our buttons (attack)
document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    })
    
    animeLetters()

    queue.push(() => {
      draggle.attack({
        attack: attacks.Tackle,
        recipient: emby,
        renderedSprites,
      })
    })
  })
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
