import { attacks } from "./attacks.js"
import { config } from "./config.js"


export const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325,
    },
    image: {
      src : './img/embySprite.png',
    },
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
    image: {
      src : './img/draggleSprite.png',
    },
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
