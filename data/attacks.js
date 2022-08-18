function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getNum(a, b, c , d, e) {
    if (Math.random() < e) {
        return Math.floor(getRandomArbitrary(a, b))
    } else {
        return Math.floor(getRandomArbitrary(c, d))
    }
}


export const attacks = {
    Tackle: {
        name: 'Tackle',
        damage: getNum(0, 15, 15 , 30, 0.3),
        type: 'Normal',
        range: '5-15',
        color: 'black'
    },
    Fireball : {
        name: 'Fireball',
        damage: getNum(10, 30, 50 , 90, 0.9),
        type: 'Fire',
        range: '25-35',
        color: 'red'
    },
    Waterball : {
        name: 'Waterball',
        damage: getNum(30, 50, 15, 35 , 0.99),
        type: 'Water',
        range: '10-45',
        color: 'blue'
    },
    Thunderball : {
        name: 'Thunderball',
        damage: 25,
        type: 'Electric',
    },
    Grassball : {
        name: 'Grassball',
        damage: 25,
        type: 'Grass',
    },
    Iceball : {
        name: 'Iceball',
        damage: 25,
        type: 'Ice',
    },
    Fightingball : {
        name: 'Fightingball',
        damage: 25,
        type: 'Fighting',
    },
    Growl : {
        name: 'Growl',
        damage: Math.floor(getRandomArbitrary(0, 50)),
        type: 'Dragon',
        range: '0-50',
        color: 'brown'
    },
    Heal : {
        name: 'Heal',
        damage: 25,
        type: 'Normal',
    },
    Poison : {
        name: 'Poison',
        damage: 5,
        type: 'Poison',
    },
  
}

