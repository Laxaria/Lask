const worldSwitchCase = {
  'neb': (sk) => { sk.rawMult.push(1.1); return true },
  'nshots': (sk) => { sk.rawMult.push(1.1); return true },
  'pshots': (sk) => { sk.rawMult.push(1.1); return true },
  'sprdshots': (sk) => { sk.rawMult.push(1.1); return true },
  'raw': (load, v) => { if (load.wp.raw === 0) { load.wp.raw = v; return true } else { return 'Weapon raw assigned more than once' } },
  'aff': (load, v) => { if (load.wp.affinity === 0) { load.wp.affinity = v; return true } else { return 'Weapon affinity assigned more than once' } },
  'ele': (load, v) => { if (load.wp.element === 0) { load.wp.element = v; return true } else { return 'Weapon element assigned more than once' } },
  '+raw': (load, v) => { load.sk.addRaw += v; return true },
  '-raw': (load, v) => { load.sk.addRaw -= v; return true },
  'xraw': (load, v) => { load.sk.rawMult.push(v); return true },
  '+aff': (load, v) => { load.sk.addAff += v; return true },
  '-aff': (load, v) => { load.sk.addAff -= v; return true },
  '+ele': (load, v) => { return 'Adding to element is not supported' },
  '-ele': (load, v) => { return 'Subtracting from element is not supported' },
  'xele': (load, v) => { load.sk.eleMult.push(v); return true },
  'we': (load, v) => { if (v >= 1 && v <= 3) { load.sk.WE = v; return true } else { return 'Failed to parse Weakness Exploit' } },
  'cb': (load, v) => { if (v >= 1 && v <= 3) { load.sk.CB = v; return true } else { return 'Failed to parse Critical Boost' } },
  'critdraw': (load, v) => {
    switch (v) {
      case 1:
        load.sk.addAff += 30
        return true
      case 2:
        load.sk.addAff += 60
        return true
      case 3:
        load.sk.addAff += 100
        return true
      default:
        return 'Failed to parse Critical Boost'
    }
  },
  'ab': (load, v) => {
    switch (v) {
      case 1:
      case 2:
      case 3:
        load.sk.addRaw += v * 3
        break
      case 4:
      case 5:
      case 6:
      case 7:
        load.sk.addRaw += v * 3
        load.sk.addAff += 5
        break
      default:
        return 'Failed to parse attack boos'
    }; return true
  },
  'pp': (load, v) => {
    switch (v) {
      case 1:
        load.sk.addRaw += 5
        return true
      case 2:
        load.sk.addRaw += 10
        return true
      case 3:
        load.sk.addRaw += 20
        return true
      default:
        return 'Failed to parse Peak Performance'
    }
  },
  'heroics': (load, v) => { if (v >= 1 && v <= 5) { load.sk.rawMult.push(1 + v * 0.05); return true } else { return 'Heroics can only go to 5' } },
  'resentment': (load, v) => { if (v >= 1 && v <= 5) { load.sk.addRaw += v * 5; return true } else { return 'Resentment can only go to 5' } },
  'eatk': (load, v) => { if (v >= 1 && v <= 5) { load.sk.eleAttack = v; return true } else { return '[Element] Attack can only go to 5' } },
  'xaff': () => { return 'Multipliers to affinity are not allowed' },
  'hits': (load, v) => { load.wp.hits = v; return true },
  'hz': (load, v) => { if (v >= 0 && v <= 2) { load.m.rawHitzone = v * 100 } else { load.m.rawHitzone = v }; return true },
  'ehz': (load, v) => { if (v >= 0 && v <= 2) { load.m.eleHitzone = v * 100 } else { load.m.eleHitzone = v }; return true },
  'ce': (load, v) => {
    switch (v) {
      case 1:
      case 2:
        load.sk.addAff += v * 3
        break
      case 3:
        load.sk.addAff += 10
        break
      case 4:
        load.sk.addAff += 15
        break
      case 5:
        load.sk.addAff += 20
        break
      case 6:
        load.sk.addAff += 25
        break
      case 7:
        load.sk.addAff += 30
        break
      default:
        return 'Failed to parse crit eye'
    } return true
  },
  'mv': (load, v) => { if (v <= 0.99) { load.wp.rawMotionValue = v * 100; return true } else if (v >= 1.0 && v <= 3.0) { load.wp.rawMotionValue = v; return true } else { return 'Raw Motion value can only go up to about 5~.' } },
  'emv': (load, v) => { if (v <= 0.99) { load.wp.eleMotionValue = v * 100; return true } else if (v >= 1.0 && v <= 3.0) { load.wp.eleMotionValue = v; return true } else { return 'Ele Motion value can only go up to about 5~.' } },
  'gdm': (load, v) => { if (v >= 1.5) { return 'Global Def Mod value should be less than 1~' } else { load.m.globalDefMod = v; return true } },
  'agitator': (load, v) => {
    switch (v) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        load.sk.addAff += 3 * v
        load.sk.addRaw += 4 * v
        return true
      default:
        return 'Agitator can only be at level 1 to level 5'
    }
  },
  'sharp': (load, v) => { load.wp.sharp = v; return true },
  'elecrit' (wp) { wp.eleCritMult = true; return true },
  'statics': ['rup', 'sprdup', 'pup', 'sprdup', 'elemental', 'neb', 'nshots', 'pshots', 'sprdshots'],
  'weaponstats': ['elecrit'],
  'weapons': [],
  'elements': ['fire', 'water', 'ice', 'thunder', 'dra', 'thun']
}

class MHWorldSieve {
  wepSieve (weapon) {
    if (worldSwitchCase['weapons'].includes(weapon.name)) {
      worldSwitchCase[weapon.name](weapon)
    }
  }

  sieve (parsedData = null, weapon = null, skills = null, monster = null) {
    let load = {
      wp: weapon,
      sk: skills,
      m: monster
    }

    if (worldSwitchCase['statics'].includes(parsedData.keyword)) {
      return worldSwitchCase[parsedData.keyword](load.sk)
    } else if (['sharp'].includes(parsedData.keyword)) {
      return worldSwitchCase[parsedData.keyword](load, parsedData.value)
    } else if (worldSwitchCase['elements'].includes(parsedData.keyword)) {
      return worldSwitchCase['ele'](load, parsedData.value)
    } else if (worldSwitchCase['weaponstats'].includes(parsedData.keyword)) {
      return worldSwitchCase[parsedData.keyword](load.wp)
    }

    if (parsedData.value !== null) {
      if (parsedData.value.includes('.')) {
        parsedData.value = parseFloat(parsedData.value)
      } else {
        parsedData.value = parseInt(parsedData.value)
      }
    } else {
      return `Unable to parse value associated with ${parsedData.keyword}`
    }

    if (parsedData.operand === null) { parsedData.operand = '' }
    try {
      return worldSwitchCase[parsedData.operand + parsedData.keyword](load, parsedData.value)
    } catch (err) {
      return `Unable to parse value associated with ${parsedData.keyword}`
    }
  }
}

module.exports = MHWorldSieve
