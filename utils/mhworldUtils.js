const worldSwitchCase = {
  'pp': (sk) => {sk.addRaw += 20; return true},
  'rup': (sk) => {sk.rawMult.push(1.1); return true},
  'nup': (sk) => {sk.rawMult.push(1.1); return true},
  'pup': (sk) => {sk.rawMult.push(1.1); return true},
  'tsu': (sk) => {sk.rawMult.push(1.2); return true},
  'sprdup': (sk) => {sk.rawMult.push(1.3); return true},
  'critdraw': (sk) => {sk.addAff += 100; return true},
  'elemental': (sk) => {sk.elemental = true; return true},
  'raw': (load, v) => { if (load.wp.raw === 0) {load.wp.raw = v; return true} else {return 'Weapon raw assigned more than once'}},
  'aff': (load, v) => { if (load.wp.affinity === 0) {load.wp.affinity = v; return true} else {return 'Weapon affinity assigned more than once'}},
  'ele': (load, v) => { if (load.wp.element === 0) {load.wp.element = v; return true} else {return 'Weapon element assigned more than once'}},
  '+raw': (load, v) => {load.sk.addRaw += v; return true},
  '-raw': (load, v) => {load.sk.addRaw -= v; return true},
  'xraw': (load, v) => {load.sk.rawMult.push(v); return true},
  '+aff': (load, v) => {load.sk.addAff += v; return true},
  '-aff': (load, v) => {load.sk.addAff -= v; return true},
  '+ele': (load, v) => {return 'Adding to element is not supported'},
  '-ele': (load, v) => {return 'Subtracting from element is not supported'},
  'xele': (load, v) => {load.sk.eleMult.push(v); return true},
  'we': (load, v) => {if (1<= v && v <= 3) {load.skill.we = v; return true} else {return 'Failed to parse Weakness Exploit'}},
  'cb': (load, v) => {if (1<= v && v <= 3) {load.skill.cb = v; return true} else {return 'Failed to parse Critical Boost'}},
  'ab': (load, v) => {
    switch(v) {
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
    }; return true},
  'eatk': (load, v) => {if (v === 1 || v === 2) {load.sk.eleAttack = v; return true} else {return '[Element] Attack can only go to 2'}},
  'xaff': () => {return 'Multipliers to affinity are not allowed'},
  'hits': (load, v) => {load.wp.hits = v; return true},
  'hz': (load, v) => {if (0 <= v && v <= 2) { load.m.rawHitzone = v * 100 } else {load.m.rawHitzone = v}; return true},
  'ehz': (load, v) => {if (0 <= v && v <= 2) { load.m.eleHitzone = v * 100 } else {load.m.eleHitzone = v}; return true},
  'ce': (load, v) => {
    switch(v) {
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
    } return true },
  'mv': (load, v) => {if (v <= 0.99) {load.wp.rawMotionValue = v * 100} else {load.wp.rawMotionValue = v}; return true},
  'emv': (load, v) => {if (v <= 0.99) {load.wp.eleMotionValue = v * 100} else {load.wp.rawMotionValue = v}; return true},
  'gdm': (load, v) => {if (v >= 1.5) {return 'Global Def Mod value should be less than 1~'} else {load.m.globalDefMod = v; return true}},
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
  'sharp': (load, v) => {load.wp.sharpMods(v); return true},
  'lbg': (wp) => {wp.rawMult = 1.3; return true},
  'hbg': (wp) => {wp.rawMult = 1.48; return true},
  'gs': (wp) => {wp.rawMult = 1.05; return true},
  'ls': (wp) => {wp.rawMult = 1.05; return true},
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
  'statics': ['rup', 'sprdup', 'pup', 'tsu', 'sprdup', 'pp', 'elemental'],
  'weaponstats': ['elecrit'],
  'weapons': ['lbg', 'hbg', 'sns'],
  'elements': ['fire', 'water', 'ice', 'thunder', 'dra', 'thun'],
}

class MHWorldSieve {
  constructor() {}

  wepSieve (weapon) {
    if (worldSwitchCase['weapons'].includes(weapon.name)) {
      worldSwitchCase[weapon.name](weapon)
    }
  }
  sieve (parsedData = null, weapon = null, skills = null, monster = null) {

    let load = {
      wp: weapon,
      sk: skills,
      m: monster,
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
  
    if (parsedData.operand === null) {parsedData.operand = ''}
  
    return worldSwitchCase[parsedData.operand+parsedData.keyword](load, parsedData.value)
  }
}

module.exports = MHWorldSieve