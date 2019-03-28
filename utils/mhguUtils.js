const rawAffStruct = {
  'raw': (wp, sk, m, v) => { if (wp.raw === 0) {wp.raw = v; return true} else {return 'Weapon raw assigned more than once'}},
  'aff': (wp, sk, m, v) => { if (wp.affinity === 0) {wp.affinity = v; return true} else {return 'Weapon affinity assigned more than once'}},
  '+raw': (wp, sk, m, v) => { sk.addRaw += v; return true},
  '-raw': (wp, sk, m, v) => { sk.addRaw -= v; return true},
  'xraw': (wp, sk, m, v) => { sk.rawMult.push(v); return true},
  '+aff': (wp, sk, m, v) => { sk.addAff += v; return true},
  '-aff': (wp, sk, m, v) => { sk.addAff += v; return true},
  'aus': (wp, sk, m, v) => { sk.addRaw += 10; return true},
  'aum': (wp, sk, m, v) => { sk.addRaw += 15; return true},
  'aul': (wp, sk, m, v) => { sk.addRaw += 20; return true},
  'we': (wp, sk, m, v) => { sk.WE = true; return true},
  'cb': (wp, sk, m, v) => { sk.CB = true; return true},
  'hz': (wp, sk, m, v) => { if (0 <= v && v <= 2) { m.rawHitzone = v * 100 } else {m.rawHitzone = v}; return true},
  'ce': (wp, sk, m, v) => { if (1 <= v && v <= 3) {sk.addAff += v * 10; return true} else {return 'MHGU Crit Eye ranges only from 1 - 3'}},
  'statics': ['aus', 'aum', 'aul', 'we', 'cb']
}

function mhguSieve(game, keyword, value, operand, weapon, skills, monster) {

  if (rawAffStruct['statics'].includes(keyword)) {
    return rawAffStruct[keyword](weapon, skills, monster, NaN)
  }

  if (!Number.isInteger(value) && value !== null) {
    value = parseFloat(value)
  } else if (Number.isInteger(value)) {
    value = parseInt(value)
  } else {
    console.log(value)
    return `Unable to parse value associated with ${keyword}`
  }

  if (Number.isNaN(value)) {
    return `${keyword}'s value was not assigned`
  } else if (keyword === 'aff' && operand === 'x') {
    return 'Multiplers to affinity are not allowed'
  }

  if (operand === null) {operand = ''}
  return rawAffStruct[operand+keyword](weapon, skills, monster, value)

}



module.exports = mhguSieve