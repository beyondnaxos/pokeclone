import { attacks } from "./attacks.js"
import { config } from "./config.js"

const embyImage = new Image()
embyImage.src = './img/embySprite.png'


const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'

export const monsters = {
  Emby: {
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
    attacks: [attacks.Tackle, attacks.Growl, attacks.Fireball, attacks.Waterball],
  },

    Draggle: {
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
    attacks: [attacks.Tackle, attacks.Fireball, attacks.Waterball],
   
    },
}
