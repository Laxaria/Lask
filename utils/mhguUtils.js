class MHGUSieve {
  constructor() {
    this.sharpConstantsRaw = {
      'purple': 1.39,
      'white': 1.32,
      'blue': 1.20,
      'green': 1.05,
      'yellow': 1.00,
      'orange': 0.75,
      'red': 0.50
    }

    this.sharpConstantsEle = {
      'purple': 1.2,
      'white': 1.125,
      'blue': 1.0625,
      'green': 1,
      'yellow': 0.75,
      'orange': 0.50,
      'red': 0.25
    }
    
    this.switchCase = {
      'raw': (load, v) => { if (load.wp.raw === 0) {load.wp.raw = v; return true} else {return 'Weapon raw assigned more than once'}},
      'aff': (load, v) => { if (load.wp.affinity === 0) {load.wp.affinity = v; return true} else {return 'Weapon affinity assigned more than once'}},
      'ele': (load, v) => { if (load.wp.element === 0) {load.wp.element = v; return true} else {return 'Weapon element assigned more than once'}},
      '+raw': (load, v) => { load.sk.addRaw += v; return true},
      '-raw': (load, v) => { load.sk.addRaw -= v; return true},
      'xraw': (load, v) => { load.sk.rawMult.push(v); return true},
      '+aff': (load, v) => { load.sk.addAff += v; return true},
      '-aff': (load, v) => { load.sk.addAff += v; return true},
      '+ele': (load, v) => { return 'Adding to element is not supported'},
      '-ele': (load, v) => { return 'Subtracting from element is not supported'},
      'xele': (load, v) => { load.sk.eleMult.push(v); return true},
      'eatk': (load, v) => { if (v === 1 || v === 2) {load.sk.eleAttack = v; return true} else {return '[Element] Attack can only go to 2'}},
      'elemental': (sk) => { sk.elemental = true; return true},
      'xaff': () => { return 'Multipliers to affinity are not allowed'},
      'aus': (sk) => { sk.addRaw += 10; return true},
      'aum': (sk) => { sk.addRaw += 15; return true},
      'aul': (sk) => { sk.addRaw += 20; return true},
      'pp': (sk) => { sk.addRaw += 20; return true},
      'we': (sk) => { sk.WE = true; return true},
      'cb': (sk) => { sk.CB = true; return true},
      'nup': (sk) => { sk.rawMult.push(1.1); return true},
      'pup': (sk) => { sk.rawMult.push(1.1); return true},
      'tsu': (sk) => { sk.rawMult.push(1.2); return true},
      'sprdup': (sk) => { sk.rawMult.push(1.3); return true},
      'critdraw': (sk) => { sk.addAff += 100; return true},
      'hz': (load, v) => { if (0 <= v && v <= 2) { load.m.rawHitzone = v * 100 } else {load.m.rawHitzone = v}; return true},
      'ehz': (load, v) => { if (0 <= v && v <= 2) { load.m.eleHitzone = v * 100 } else {load.m.eleHitzone = v}; return true},
      'ce': (load, v) => { if (1 <= v && v <= 3) { load.sk.addAff += v * 10; return true} else {return 'MHGU Crit Eye ranges only from 1 - 3'}},
      'mv': (load, v) => { if (v <= 0.99) {load.wp.rawMotionValue = v * 100} else {load.wp.rawMotionValue = v}; return true},
      'emv': (load, v) => { if (v <= 0.99) {load.wp.eleMotionValue = v * 100} else {load.wp.rawMotionValue = v}; return true},
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
      'sharp': (load, v) => { load.wp.sharpRaw = this.sharpConstantsRaw[v]; load.wp.sharpEle = this.sharpConstantsEle[v]; return true},
      'lbg': (wp) => { wp.rawMult = 1.3; return true},
      'hbg': (wp) => { wp.rawMult = 1.48; return true},
      'sns': (wp) => { wp.rawMult = 1.05;return true},
      'elecrit' (wp) { 
        switch (wp.name) {
          case 'lbg':
          case 'hbg':
            wp.eleCritMult = 0.3
            return true
          case 'bow':
          case 'sns':
          case 'db':
          case 'dbs':
            wp.eleCritMult = 0.35
            return true
          case 'gs':
            wp.eleCritMult = 0.3
            return true
          default:
            wp.eleCritMult = 0.25
        }
      },
      'statics': ['aus', 'aum', 'aul', 'we', 'cb', 'nup', 'sprdup', 'pup', 'tsu', 'sprdup', 'pp', 'elemental', 'critdraw'],
      'weaponstats': ['elecrit'],
      'weapons': ['lbg', 'hbg', 'sns'],
      'elements': ['fire', 'water', 'ice', 'thunder', 'dra', 'thun'],
    }
  }
  wepSieve (weapon) {
    if (this.switchCase['weapons'].includes(weapon.name)) {
      this.switchCase[weapon.name](weapon)
    }
  }
  sieve (parsedData = null, weapon = null, skills = null, monster = null) {
    let load = {
      wp: weapon,
      sk: skills,
      m: monster,
    }
  
    if (this.switchCase['statics'].includes(parsedData.keyword)) {
      return this.switchCase[parsedData.keyword](load.sk)
    } else if (['sharp'].includes(parsedData.keyword)) {
      return this.switchCase[parsedData.keyword](load, parsedData.value)
    } else if (this.switchCase['elements'].includes(parsedData.keyword)) {
      return this.switchCase['ele'](load, parsedData.value)
    } else if (this.switchCase['weaponstats'].includes(parsedData.keyword)) {
      return this.switchCase[parsedData.keyword](load.wp)
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
  
    if (parsedData.operand === null) {parsedData.operand = ''}
  
    return this.switchCase[parsedData.operand+parsedData.keyword](load, parsedData.value)
  }
}

module.exports = MHGUSieve