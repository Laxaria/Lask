const MHWorldSieve = {
  'neb': (sk) => { sk.rawMult.push(1.1); return true },
  'nshots': (sk) => { sk.rawMult.push(1.1); return true },
  'pshots': (sk) => { sk.rawMult.push(1.1); return true },
  'sprdshots': (sk) => { sk.rawMult.push(1.1); return true },
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

module.exports = MHWorldSieve
