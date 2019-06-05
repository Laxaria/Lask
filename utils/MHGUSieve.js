const MHGUSieve = {
  'aus': (sk) => { sk.addRaw += 10; return true },
  'aum': (sk) => { sk.addRaw += 15; return true },
  'aul': (sk) => { sk.addRaw += 20; return true },
  'pp': (sk) => { sk.addRaw += 20; return true },
  'we': (sk) => { sk.WE = true; return true },
  'cb': (sk) => { sk.CB = true; return true },
  'rup': (sk) => { sk.rawMult.push(1.1); return true },
  'nup': (sk) => { sk.rawMult.push(1.1); return true },
  'pup': (sk) => { sk.rawMult.push(1.1); return true },
  'tsu': (sk) => { sk.rawMult.push(1.2); return true },
  'sprdup': (sk) => { sk.rawMult.push(1.3); return true },
  'critdraw': (sk) => { sk.addAff += 100; return true },
  'raw': (load, v) => { if (load.wp.raw === 0) { load.wp.raw = v; return true } else { return 'Weapon raw assigned more than once' } },
  'elemental': (sk) => { sk.elemental = true; return true },
  'eatk': (load, v) => { if (v === 1 || v === 2) { load.sk.eleAttack = v; return true } else { return '[Element] Attack can only go to 2' } },
  'ce': (load, v) => { if (v >= 1 && v <= 3) { load.sk.addAff += v * 10; return true } else { return 'MHGU Crit Eye ranges only from 1 - 3' } },
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
  'sharp': (load, v) => { load.wp.sharp = v; return true },
  'lbg': (wp) => { wp.rawMult = 1.3; return true },
  'hbg': (wp) => { wp.rawMult = 1.48; return true },
  'sns': (wp) => { wp.rawMult = 1.06; return true },
  'gs': (wp) => { wp.rawMult = 1.05; return true },
  'ls': (wp) => { wp.rawMult = 1.05; return true },
  'elecrit': (wp) => { wp.eleCritMult = true; return true },
  'draw': () => { return 'Display raw is only supported for MHWorld' },
  'statics': ['aus', 'aum', 'aul', 'we', 'cb', 'rup', 'nup', 'sprdup', 'pup', 'tsu', 'sprdup', 'pp', 'elemental', 'critdraw'],
  'weaponstats': ['elecrit'],
  'weapons': ['lbg', 'hbg', 'sns', 'gs', 'ls'],
  'elements': ['fire', 'water', 'ice', 'thunder', 'dra', 'thun']
}

module.exports = MHGUSieve
