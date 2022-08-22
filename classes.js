export class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1
  }) {
    this.position = position
    this.image = new Image()
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
      console.log(this.width, this.height)
    }
    this.image.src = image.src
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.rotation = rotation
    this.scale = scale
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

    const crop = {
      position : {
        x: this.frames.val * this.width,
        y: 0
      },
      width : this.image.width / this.frames.max,
      height : this.image.height
    }

    const image = {
      position : {
        x: this.position.x,
        y: this.position.y
      },
      width :  this.image.width / this.frames.max,
      height : this.image.height
    }
    
    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      image.position.x,
      image.position.y,
      image.width * this.scale,
      image.height * this.scale
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
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
    })
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
    this.attacks = attacks
  }

  faint() {
    document.querySelector('.letters').innerHTML = this.name + ' fainted'
    gsap.to(this.position, {
      y: this.position.y + 20,
    })
    gsap.to(this, {
      opacity: 0,
    })
    audio.battle.stop()
    audio.victory.play()
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#dialogueBox').style.display = 'flex'
    if (attack.damage > 25) {
      document.querySelector('.letters').style.color = 'red'
      document.querySelector('.letters').innerHTML =
        '<b class="red">Critical </b>' +
        this.name +
        ' used ' +
        attack.name +
        ' ' +
        recipient.name +
        '  lost ' +
        attack.damage +
        ' health points'
    } else {
      document.querySelector('.letters').style.color = 'black'
      document.querySelector('.letters').innerHTML =
        this.name +
        ' used ' +
        attack.name +
        ' , ' +
        recipient.name +
        '  lost ' +
        attack.damage +
        ' health points'
    }

    let healthBar = '#enemyHealthBar'
    if (this.isEnemy) healthBar = '#playerHealthBar'

    let rotation = 1

    if (this.isEnemy) rotation = -2.2
    recipient.health -= attack.damage

    switch (attack.name) {
      case 'Fireball':
        audio.fireball.play()
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
          rotation,
        })
        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            audio.fireballHit.play()

            gsap.to(healthBar, {
              width: recipient.health + '%',
            })
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
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
        audio.fireball.play()
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
          rotation,
        })
        renderedSprites.splice(1, 0, waterball)

        gsap.to(waterball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
      
              audio.tackle.play()
        
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
        audio.tackle.play()
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
          rotation,
        })
        renderedSprites.splice(1, 0, growl)

        gsap.to(growl.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            audio.gustHit.play()

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
        audio.tackle.play()
        const tl = gsap.timeline()

        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              audio.tackleHit.play()

              gsap.to(healthBar, {
                width: recipient.health + '%',
              })
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
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
