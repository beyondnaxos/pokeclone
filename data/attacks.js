function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }



export const attacks = {
    Tackle: {
        name: 'Tackle',
        damage: Math.floor(getRandomArbitrary(5, 15)),
        type: 'normal',
      },
    Fireball : {
        name: 'Fireball',
        damage: Math.floor(getRandomArbitrary(25, 35)),
        type: 'fire',
    },
    Waterball : {
        name: 'Waterball',
        damage: Math.floor(getRandomArbitrary(10, 45)),
        type: 'water',
    },
    Thunderball : {
        name: 'Thunderball',
        damage: 25,
        type: 'electric',
    },
    Grassball : {
        name: 'Grassball',
        damage: 25,
        type: 'grass',
    },
    Iceball : {
        name: 'Iceball',
        damage: 25,
        type: 'ice',
    },
    Fightingball : {
        name: 'Fightingball',
        damage: 25,
        type: 'fighting',
    },
    Growl : {
        name: 'Growl',
        damage: Math.floor(getRandomArbitrary(5, 15)),
        type: 'normal',
    },
    Heal : {
        name: 'Heal',
        damage: 25,
        type: 'normal',
    },
    Poison : {
        name: 'Poison',
        damage: 5,
        type: 'poison',
    },

}