const Lask = require('./Lask.js')

let TESTS = {
  '1' : {
    'string': '320 raw, 40 aff, 15 hz, we',
    'value': 52 
  },
  '2' : {
    'string': '100 raw, 0 aff, 15 hz, we, cb, AUL, 1.5x raw',
    'value': 27
  },
  '3' : {
    'string': '320 raw, 40 aff, 0.45 hz, we, cb, +22 raw, ce3',
    'value': 215
  },
  '4' : {
    'string': 'nad, good, haha',
    'value': 'fail'
  },
  '5' : {
    'string': '320 raw, 40 aff, 60 hz, 1.5x raw, we, cb',
    'value': 391
  },
  '6' : {
    'string': '3450sab',
    'value': 'fail'
  },
  '7' : {
    'string': 'mhgu cb: 320 raw, 40 aff, 60 hz, 1.5x raw, we, cb, ce2, aus, aul, +32 raw, +45 aff, 2.0x raw, 0.2x raw, ch2, ch+2, ce3, 0.22 mv',
    'value': 46
  },
  '8' : {
    'string': 'mhgu bow: 320 raw,40 aff,60 hz,1.5x raw,we,cb,0.22 mv,0.80 gdm, ce+3',
    'value': 70
  },
  '9' : {
    'string': 'hbg: 40 aff, 15 hz, we, purple sharp, 320 raw, sprdup',
    'value': 95/1.3*1.3*1.5
  },
  '10' : {
    'string': '320 raw',
    'value': 320
  },
  '11' : {
    'string': '100 raw, aul, +20 raw',
    'value': 140
  },
  '12' : {
    'string': '100 raw, we, cb, 50 aff, 100 hz',
    'value': 140
  },
  '12' : {
    'string': '100 ele, 100 ehz, 100 raw, 100 hz',
    'value': 200
  },
  '13' : {
    'string': 'bow: 100 fire, 100 aff, 100 ehz, elecrit',
    'value': 100 * 1.35
  },
}

Object.entries(TESTS).forEach(([test, data]) => {
  // console.log('---')
  let dmgCalc = new Lask(data['string'])
  let output = dmgCalc.effectiveRawCalc(true)
  if ( dmgCalc.parse.errmsg.length > 2 && (data['value'] === 'fail') ) {
    // console.log('Success')
  }
  else if (Math.abs(output - data['value']) <= 1) {
    // console.log('Success')
  } else {
    console.log(JSON.stringify(dmgCalc.weaponStats(), null, 2))
    console.log(output)
    console.log(`Test ${test} failed`)
  }
});
