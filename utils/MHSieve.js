class MHSieve {
  constructor (flag = 'mhgu') {
    this.sieveTable = {
      'raw': (load, v) => { if (load.wp.raw === 0) { load.wp.raw = v; return true } else { return 'Weapon raw assigned more than once' } },
      'aff': (load, v) => { if (load.wp.affinity === 0) { load.wp.affinity = v; return true } else { return 'Weapon affinity assigned more than once' } },
      'ele': (load, v) => { if (load.wp.element === 0) { load.wp.element = v; return true } else { return 'Weapon element assigned more than once' } },
      '+raw': (load, v) => { load.sk.addRaw += v; return true },
      '-raw': (load, v) => { load.sk.addRaw -= v; return true },
      'xraw': (load, v) => { load.sk.rawMult.push(v); return true },
      '+aff': (load, v) => { load.sk.addAff += v; return true },
      '-aff': (load, v) => { load.sk.addAff -= v; return true },
      '+ele': (_load, _v) => { return 'Adding to element is not supported' },
      '-ele': (_load, _v) => { return 'Subtracting from element is not supported' },
      'xele': (load, v) => { load.sk.eleMult.push(v); return true },
      'xaff': () => { return 'Multipliers to affinity are not allowed' },
      'hits': (load, v) => { load.wp.hits = v; return true },
      'hz': (load, v) => { if (v >= 0 && v <= 2) { load.m.rawHitzone = v * 100 } else { load.m.rawHitzone = v }; return true },
      'ehz': (load, v) => { if (v >= 0 && v <= 2) { load.m.eleHitzone = v * 100 } else { load.m.eleHitzone = v }; return true },
      'mv': (load, v) => { if (v <= 0.99) { load.wp.rawMotionValue = v * 100; return true } else if (v >= 1.0 && v <= 250) { load.wp.rawMotionValue = v; return true } else { return 'Raw Motion value can only go up to about 2.5~.' } },
      'emv': (load, v) => { if (v <= 0.99) { load.wp.eleMotionValue = v * 100; return true } else if (v >= 1.0 && v <= 250) { load.wp.eleMotionValue = v; return true } else { return 'Ele Motion value can only go up to about 2.5~.' } },
      'gdm': (load, v) => { if (v >= 1.5) { return 'Global Def Mod value should be less than 1~' } else { load.m.globalDefMod = v; return true } }
    }
    this._gameSieve(flag)
  }

  _gameSieve (flag) {
    switch (flag) {
      case 'mhworld':
        const MHWorldSieve = require('./MHWorldSieve')
        this.sieveTable = { ...this.sieveTable, ...MHWorldSieve }
        break
      case 'mhgu':
      // fall through intended making mhgu default
      default:
        const MHGUSieve = require('./MHGUSieve')
        this.sieveTable = { ...this.sieveTable, ...MHGUSieve }
        break
    }
  }

  _log () {
    console.log(this.sieveTable)
  }

  _parseToNumber (parsedData) {
    let result
    if (!isFinite(parsedData.value)) {
      result = parsedData.value
    } else {
      if (parsedData.value !== null) {
        if (parsedData.value.includes('.')) {
          result = parseFloat(parsedData.value)
        } else {
          result = parseInt(parsedData.value)
        }
      } else {
        result = `Unable to parse value associated with ${parsedData.keyword}`
      }
    }
    return result
  }

  wepSieve (weapon) {
    if (this.sieveTable['weapons'].includes(weapon.type)) {
      this.sieveTable[weapon.type](weapon)
    }
  }

  sieve (parsedData = null, weapon = null, skills = null, monster = null) {
    let load = {
      wp: weapon,
      sk: skills,
      m: monster
    }

    parsedData.value = this._parseToNumber(parsedData)

    if (this.sieveTable['statics'].includes(parsedData.keyword)) {
      return this.sieveTable[parsedData.keyword](load.sk)
    } else if (['sharp'].includes(parsedData.keyword)) {
      return this.sieveTable[parsedData.keyword](load, parsedData.value)
    } else if (this.sieveTable['elements'].includes(parsedData.keyword)) {
      return this.sieveTable['ele'](load, parsedData.value)
    } else if (this.sieveTable['weaponstats'].includes(parsedData.keyword)) {
      return this.sieveTable[parsedData.keyword](load.wp)
    }

    if (parsedData.operand === null) { parsedData.operand = '' }

    try {
      return this.sieveTable[parsedData.operand + parsedData.keyword](load, parsedData.value)
    } catch (err) {
      return `Unable to parse value associated with ${parsedData.keyword}`
    }
  }
}

module.exports = MHSieve
