import { Sprite } from '/classes.js'
import { attacks } from './data/attacks.js'
import { config } from './data/config.js'
import { monsters } from './data/monsters.js'
import { Monster } from './classes.js'

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

const draggle = new Monster(monsters.Draggle)

const emby = new Monster(monsters.Emby)

const renderedSprites = [draggle, emby]

emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attackBox').append(button)
})



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
    const randomAttack = draggle.attacks[Math.floor(Math.random()* draggle.attacks.length)]

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites,
      })
    })
  })
  button.addEventListener('mouseenter', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    document.querySelector('#attackType').innerHTML = selectedAttack.type + ' ' + selectedAttack.range
    document.querySelector('#attackType').style.color = selectedAttack.color
  })
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
