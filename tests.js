const Lask = require('./Lask.js')

let TESTS = {
  '1': {
    'string': '320 raw, 40 aff, 15 hz, we',
    'value': 52
  },
  '2': {
    'string': '100 raw, 0 aff, 15 hz, we, cb, AUL, 1.5x raw',
    'value': 27
  },
  '3': {
    'string': 'mhgu: 320 raw, 40 aff, 0.45 hz, we, cb, +22 raw, ce3',
    'value': 215
  },
  '4': {
    'string': 'nad, good, haha',
    'value': 123
  },
  '5': {
    'string': 'mhgu: 320 raw, 40 aff, 60 hz, 1.5x raw, we, cb',
    'value': 391
  },
  '6': {
    'string': '3450sab',
    'value': 'fail'
  },
  '7': {
    'string': 'mhgu cb: 320 raw, 40 aff, 60 hz, 1.5x raw, we, cb, ce2, aus, aul, +32 raw, +45 aff, 2.0x raw, 0.2x raw, ch2, ch+2, ce3, 0.22 mv',
    'value': 46
  },
  '8': {
    'string': 'mhgu bow: 320 raw,40 aff,60 hz,1.5x raw,we,cb,0.22 mv,0.80 gdm, ce+3',
    'value': 70
  },
  '9': {
    'string': 'hbg: 40 aff, 15 hz, we, 320 raw, sprdup',
    'value': 101
  },
  '10': {
    'string': '320 raw',
    'value': 320
  },
  '11': {
    'string': '100 raw, aul, +20 raw',
    'value': 140
  },
  '12': {
    'string': '100 raw, we, cb, 50 aff, 100 hz',
    'value': 140
  },
  '12.5': {
    'string': '100 ele, 100 ehz, 100 raw, 100 hz',
    'value': 200
  },
  '13': {
    'string': 'mhgu bow: 100 fire, 100 aff, 100 ehz, elecrit',
    'value': 100 * 1.35
  },
  '14': {
    'string': 'mhgu db: 100 raw, 10 fire, 0.28 mv, we, cb, 40 aff, 45 hz, 20 ehz, white sharp, elecrit',
    'value': 25
  },
  '15': {
    'string': 'mhgu db: 40 thun, eatk2, white sharp, 100 aff, critele, elemental, 1.3x ele',
    'value': 106
  },
  '16': {
    'string': 'gs: critdraw, 320 raw, purple sharp, 0.5 hz',
    'value': 291
  },
  '17': {
    'string': 'mhgu lbg: 320 raw, ch+2, .69 emv, elemental, eatk2, .05 mv, 40 hz, 20 ehz',
    'value': 63
  },
  '18': {
    'string': 'bow: 320 raw, nup, 5x hits,',
    'value': 320 * 1.1
  },
  '19': {
    'string': 'mhworld bow: 320 raw, 40 aff, ab4',
    'value': 369
  },
  '20': {
    'string': 'lbg: 280 raw, eatk2, 45 hz, we, cb, elecrit, 0.21 mv, 0.45 ehz,',
    'value': 41
  },
  '21': {
    'string': 'mhworld cb: 220 raw, 45 hz, we3, cb2, 0.21 mv, heroics2',
    'value': 26
  },
  '22': {
    'string': 'mhgu lbg: 100 raw, eatk+2, elemental, 45 emv, 21 ehz, aul',
    'value': 13
  },
  '23': {
    'string': 'mhworld lbg: 130 draw, +10 raw',
    'value': 110
  },
  '24': {
    'string': 'mhworld lbg: 100 raw, +10 raw',
    'value': 110
  },
  '25': {
    'string': 'mhworld asr: 100 draw, +10 raw',
    'value': 110
  },
  '26': {
    'string': 'mhgu lbg: 130 raw, +10 raw, firefox ice',
    'value': 110
  }
}

Object.entries(TESTS).forEach(([test, data]) => {
  console.log('---')
  let lask = new Lask()
  lask.parseString(data['string'])
  let output = lask.effectiveDmgCalc()
  if (lask.error() && (data['value'] === 'fail')) {
    console.log(`${test} Success`)
  } else if (Math.abs(output.totalDamage - data['value']) <= 1) {
    console.log(`${test} Success`)
  } else {
    console.log(JSON.stringify(output, null, 2))
    console.log(lask.errorMessage())
    console.log(`Test ${test} failed`)
  }
})
