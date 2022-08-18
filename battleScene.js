import { Sprite } from '/classes.js'
import { attacks } from './data/attacks.js'
import { config } from './data/config.js'
import { monsters } from './data/monsters.js'
import { Monster } from './classes.js'
import { animate, battle } from './index.js'
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
          document.querySelector('.ml11 .letters').getBoundingClientRect()
            .width + 10,
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

      let draggle
      let emby
      let renderedSprites
      let battleAnimationId
      let queue
      
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

export function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attackBox').replaceChildren()
  
  draggle = new Monster(monsters.Draggle)
  emby = new Monster(monsters.Emby)
  renderedSprites = [draggle, emby]
  queue = []
  
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attackBox').append(button)
  })

  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      emby.attack({
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites
      })

      animeLetters()

      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint()
        })
        queue.push(() => {
          // fade back to black
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'
              gsap.to('#overlappingDiv', {
                opacity: 0,
              })
              battle.initiated = false

            },
          })
        })
      }

      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

      queue.push(() => {
        draggle.attack({
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        })
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint()
          })
          queue.push(() => {
            gsap.to('#overlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#userInterface').style.display = 'none'
                gsap.to('#overlappingDiv', {
                  opacity: 0,
                })
                battle.initiated = false
              },
            })
          })
        }
      })
    })
    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      document.querySelector('#attackType').innerHTML =
        selectedAttack.type + ' ' + selectedAttack.range
      document.querySelector('#attackType').style.color = selectedAttack.color
    })
  })
}

export function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw(c)

  renderedSprites.forEach((sprite) => {
    sprite.draw(c)
  })
}

initBattle()
animateBattle()


// our event listeners for our buttons (attack)

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
