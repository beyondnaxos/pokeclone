export class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name
  }) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
      console.log(this.width, this.height)
    }
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.rotation = rotation

  }

  draw(c) {
    c.save()
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )

    c.rotate(this.rotation)
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    c.globalAlpha = this.opacity
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    c.restore()

    if (!this.animate) return
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }

  
}


export class Monster extends Sprite {

  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks
  }) {
    super({
      position,
    image,
    frames,
    sprites,
    animate ,
    rotation 
    })
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
    this.attacks = attacks
  }

  faint() {
    document.querySelector('.letters').innerHTML = this.name + ' fainted'
    gsap.to(this.position, {
      y : this.position.y +20,

    })
    gsap.to(this, {
      opacity : 0,
    })
  }

  
  attack({ attack, recipient, renderedSprites }) {

    document.querySelector('#dialogueBox').style.display = 'flex'
    if(attack.damage > 25) {
      document.querySelector('.letters').style.color = 'red'
      document.querySelector('.letters').innerHTML = '<b class="red">Critical </b>'  + this.name + ' used ' + attack.name + ' ' + recipient.name  + '  lost ' + attack.damage + ' health points' 
    } else {
      document.querySelector('.letters').style.color = 'black'
      document.querySelector('.letters').innerHTML =  this.name + ' used ' + attack.name + ' , ' + recipient.name  + '  lost ' + attack.damage + ' health points'
    }


    let healthBar = '#enemyHealthBar'
    if (this.isEnemy) healthBar = '#playerHealthBar'

    let rotation = 1

    if (this.isEnemy) rotation = -2.2
    recipient.health -= attack.damage

    switch (attack.name) {
      case 'Fireball':

        const fireballImage = new Image()
        fireballImage.src = './img/fireball.png'
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation
        })
        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            gsap.to(healthBar, {
              width: recipient.health + '%',
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + 12,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })
            renderedSprites.splice(1, 1)
          },
        })

        break
      case 'Waterball':

        const waterballImage = new Image()
        waterballImage.src = './img/fireball.png'
        const waterball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: waterballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation
        })
        renderedSprites.splice(1, 0, waterball)

        gsap.to(waterball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            gsap.to(healthBar, {
              width: recipient.health + '%',
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + 12,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })
            renderedSprites.splice(1, 1)
          },
        })

        break
        
      case 'Growl':

        const growlImage = new Image()
        growlImage.src = './img/fireball.png'
        const growl = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: growlImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation
        })
        renderedSprites.splice(1, 0, growl)

        gsap.to(growl.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            gsap.to(healthBar, {
              width: recipient.health + '%',
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + 12,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            })
            renderedSprites.splice(1, 1)
          },
        })

        break
        
      
        case 'Tackle':
        const tl = gsap.timeline()

        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            y: this.position.y - movementDistance - 10,
            duration: 0.1,
            onComplete: () => {
              // Enemy actually gets hit
              gsap.to(healthBar, {
                width: this.health + '%',
              })
              gsap.to(recipient.position, {
                x: recipient.position.x + 12,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              })

              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              })
            },
          })
          .to(this.position, {
            x: this.position.x,
            y: this.position.y,
          })
        break
    }
  }
}

export class Boundary {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw(c) {
    c.fillStyle = 'rgba(255, 0, 0, 0.0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}
