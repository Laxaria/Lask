const sharpConstants = {
  'purple': 1.39,
  'white': 1.32,
  'blue': 1.20,
  'green': 1.05,
  'yellow': 1.00,
  'orange': 0.75,
  'red': 0.50
}

const rawAffStruct = {
  'raw': (load, v) => { if (load.wp.raw === 0) {load.wp.raw = v; return true} else {return 'Weapon raw assigned more than once'}},
  'aff': (load, v) => { if (load.wp.affinity === 0) {load.wp.affinity = v; return true} else {return 'Weapon affinity assigned more than once'}},
  '+raw': (load, v) => { load.sk.addRaw += v; return true},
  '-raw': (load, v) => { load.sk.addRaw -= v; return true},
  'xraw': (load, v) => { load.sk.rawMult.push(v); return true},
  '+aff': (load, v) => { load.sk.addAff += v; return true},
  '-aff': (load, v) => { load.sk.addAff += v; return true},
  'xaff': () => { return 'Multipliers to affinity are not allowed'},
  'aus': (sk) => { sk.addRaw += 10; return true},
  'aum': (sk) => { sk.addRaw += 15; return true},
  'aul': (sk) => { sk.addRaw += 20; return true},
  'we': (sk) => { sk.WE = true; return true},
  'cb': (sk) => { sk.CB = true; return true},
  'nup': (sk) => { sk.rawMult.push(1.1); return true},
  'pup': (sk) => { sk.rawMult.push(1.1); return true},
  'tsu': (sk) => { sk.rawMult.push(1.2); return true},
  'sprdup': (sk) => { sk.rawMult.push(1.3); return true},
  'hz': (load, v) => { if (0 <= v && v <= 2) { load.m.rawHitzone = v * 100 } else {load.m.rawHitzone = v}; return true},
  'ce': (load, v) => { if (1 <= v && v <= 3) { load.sk.addAff += v * 10; return true} else {return 'MHGU Crit Eye ranges only from 1 - 3'}},
  'mv': (load, v) => { if (v <= 1.5) {load.wp.rawMotionValue = v * 100} else {load.wp.rawMotionValue = v}; return true},
  'gdm': (load, v) => { if (v >= 1.5) {return 'Global Def Mod value should be less than 1~'} else {load.m.globalDefMod = v; return true}},
  'ch': (load, v) => { 
    switch (v) {
      case 1:
        load.sk.addAff += 10
        load.sk.addRaw += 10
        return true
      case 2:
        load.sk.addAff += 15
        load.sk.addRaw += 20 
        return true
      default:
      return 'Challenge can only be at level 1 or level 2'
    }
  },
  'sharp': (load, v) => { load.sk.rawMult.push(sharpConstants[v]); return true},
  'lbg': (sk) => { sk.rawMult.push(1.3); return true},
  'hbg': (sk) => { sk.rawMult.push(1.5); return true},
  'statics': ['aus', 'aum', 'aul', 'we', 'cb', 'nup', 'sprdup', 'pup', 'tsu', 'sprdup'],
  'weapons': ['lbg', 'hbg']
}

function mhguSieve(payload, weapon, skills, monster) {

  let load = {
    wp: weapon,
    sk: skills,
    m: monster,
  }

  if (rawAffStruct['statics'].includes(payload.keyword)) {
    return rawAffStruct[payload.keyword](load.sk)
  }

  if (rawAffStruct['weapons'].includes(load.wp)) {
    return rawAffStruct[load.wp](load.sk)
  }

  if (['sharp'].includes(payload.keyword)) {
    return rawAffStruct[payload.keyword](load, payload.value)
  }

  if (!Number.isInteger(payload.value) && payload.value !== null) {
    payload.value = parseFloat(payload.value)
  } else if (Number.isInteger(payload.value)) {
    payload.value = parseInt(payload.value)
  } else {
    return `Unable to parse value associated with ${payload.keyword}`
  }

  if (payload.operand === null) {payload.operand = ''}

  return rawAffStruct[payload.operand+payload.keyword](load, payload.value)

}

module.exports = mhguSieve