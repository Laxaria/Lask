
class MHSet {
  constructor(game, weapon, skills, monster) {
    this.game = game
    this.weapon = weapon
    this.skills = skills
    this.monster = monster
    this._assumptions = []
  }

  _sharps(game, type, color) {
    const sharpConstantsRaw = {
      'purple': 1.39,
      'white': 1.32,
      'blue': 1.20,
      'green': 1.05,
      'yellow': 1.00,
      'orange': 0.75,
      'red': 0.50,
      'null': 1.0
    }
    
    const sharpConstantsEle = {
      'purple': 1.2,
      'white': 1.125,
      'blue': 1.0625,
      'green': 1,
      'yellow': 0.75,
      'orange': 0.50,
      'red': 0.25,
      'null': 1.0
    }

    switch (game) {
      case 'mhworld':
      case 'mhgu':
      default:
        switch (type) {
          case 'raw':
            return sharpConstantsRaw[color]
          case 'element':
            return sharpConstantsEle[color]
        }
    }
  }
  get data() {
    return [this.weapon, this.skills, this.monster]
  }
  
  get weaponType() {
    return this.weapon.type
  }

  get weaponNullRaw() {
    return this.weapon.nullRaw
  }

  get stringWeaponRawMult() {
    if (this.skills.rawMult.length === 0) {
      return ''
    } else {
      return ' * ' + this.skills.rawMult.join(' * ')
    }
  }

  get assumptions() {
    let _sets = new Set(this._assumptions)
    let _assums = []
    switch (this._assumptions.length) {
      case 0:
        return ''
      default:
        let counter = 0
        for (let e of _sets.entries()) {
          _assums.push(`(${counter+1}) ${e[0]}`)
          counter += 1
        }
        break
    }
    return `${_assums.join(' ')}`
  }

  get weaponHits() {
    return this.weapon.hits
  }

  get monsterRawHitzone() {
    switch (this.monster.rawHitzone) {
      case null:
        this._assumptions.push('Monster had a 100 element hitzone.')
        return 100
      default:
        return this.monster.rawHitzone
    }
  }

  get monsterEleHitzone() {
    switch (this.monster.eleHitzone) {
      case null:
        this._assumptions.push('Monster had a 100 element hitzone.')
        return 100
      default:
        return this.monster.eleHitzone
    }
  }

  get monsterDefMod() {
    switch (this.monster.globalDefMod) {
      case null:
        this._assumptions.push('Monster defense modifier was 1.0')
        return 1
      default:
        return this.monster.globalDefMod
    }
  }

  get weaponSharpMod() {
    let _struct = {
      'raw': 1.00,
      'element': 1.00
    }
    switch (this.weapon.type) {
      case 'lbg':
      case 'hbg':
      case 'bow':
        return _struct
      default:
        switch (this.weapon.sharp) {
          case null:
            this._assumptions.push('A sharpness multiplier of 1.0x raw and 1.0x element was added.')
            _struct.raw = 1.00
            _struct.element = 1.00
            return _struct
          default:
            _struct.raw = this._sharps(this.game, 'raw', this.weapon.sharp)
            _struct.element = this._sharps(this.game, 'element', this.weapon.sharp)
            return _struct
        } 
    }
  }

  get weaponRawModifier() {
    switch (this.weapon.rawMult) {
      case null:
        return 1
      default:
        this._assumptions.push(`Added weapon-specific multiplier of ${this.weapon.rawMult} for raw damage.`)
        return this.weapon.rawMult
    }
  }

  get weaponRawMV() {
    switch (this.weapon.rawMotionValue) {
      case null:
        this._assumptions.push('Weapon raw motion value was 100.')
        return 100
      default:
      return this.weapon.rawMotionValue
    }
  }

  get weaponEleMV() {
    switch (this.weapon.eleMotionValue) {
      case null:
        if (this.weaponType === 'lbg' || this.weaponType === 'hbg') {
          this._assumptions.push('Weapon element motion value was must be set.')
          return null
        } else {
          this._assumptions.push('Weapon element motion value was 100.')
          return 100
        }
      default:
        return this.weapon.eleMotionValue
    }
  }

  get weaponRaw() {
    return this.weapon.raw
  }

  get additionalRaw() {
    return this.skills.addRaw
  }

  get weaponTotalRaw() {
    return this.weapon.raw + this.skills.addRaw
  }

  get weaponAffinity() {
    return this.weapon.affinity
  }

  get additionalAffinity() {
    return this.skills.addAff
  }

  get weaponTotalAffinity() {
    let _totalAffinity = parseInt(this.weaponAffinity) + parseInt(this.additionalAffinity)
    if (this.monsterRawHitzone >= 45) {
      _totalAffinity += this.weModifier
    }
    if (_totalAffinity >= 100) {
      _totalAffinity = 100
    }
    return _totalAffinity
  }

  get weaponElement() {
    switch (this.weapon.type) {
      case 'lbg':
      case 'hbg':
        if (this.game === 'mhgu') {this.skills.eleMult.push(0.95)}
        if (this.weaponEleMV !== null) {
          this.weapon.element = this.weaponTotalRaw
          this.weapon.nullRaw = true
        } else {
          this.weapon.element = 0
        }
    }
    let wpElement = this.weapon.element
    let wpEleMults = 1.0
    switch (this.game) {
      case 'mhgu':
        if (this.skills.elemental) {
          wpEleMults += 0.1
        }
        switch (this.skills.eleAttack) {
          case 1:
            wpEleMults += 0.05
            wpElement = Math.floor(wpElement * wpEleMults) + 4
            break
          case 2:
            wpEleMults += 0.10
            wpElement = Math.floor(wpElement * wpEleMults) + 6
            break
          default:
            break
        }
        case 'mhworld':
          break
        default:
          break
    }
    if (this.weapon.nullRaw && this.weapon.rawMV === null) {
      this._assumptions.push('No raw damage dealt for pure Bowgun elemental damage calculations. Indicate a raw mv to include raw damage.')
    }
    return parseFloat(wpElement)
  }

  get rawMultipliers() {
    let multiplier = 1.0
    if (this.skills.rawMult.length == 0) {
      return multiplier
    } else {
      this.skills.rawMult.forEach((i) => {
        multiplier *= i
      })
      return multiplier
    }
  }

  get eleMultipliers() {
    let multiplier = 1.0
    if (this.skills.eleMult.length === 0) {
      return multiplier
    } else {
      this.skills.eleMult.forEach((i) => {
        multiplier *= i
      })
      return multiplier
    }

  }

  get critModifier() {
    switch (this.game) {
      case 'mhgu':
        switch (this.skills.CB) {
          case true:
            return 0.40
          case false:
            return 0.25
        }
        break
      case 'mhworld':
        switch (this.skills.CB) {
          case 1:
            return 0.30
          case 2:
            return 0.35
          case 3:
            return 0.40
          default:
            return 0.25
        }
      default:
        return 0.25
    }
  }

  get weModifier() {
    switch (this.game) {
      case 'mhgu':
        switch (this.skills.WE) {
          case true:
            return 50
          case false:
            return 0
          default:
            return 0
        }
      case 'mhworld':
        switch (this.skills.WE) {
          case 1:
            return 15
          case 2:
            return 30
          case 3:
            return 50
          default:
            return 0
        }
      default:
        return 0
    }
  }

  get eleCritModifier() {
    if (this.weapon.eleCritMult === true) {
      switch (this.game) {
        case 'mhgu':
          switch (this.weapon.type) {
            case 'lbg':
            case 'hbg':
              return 0.30
            case 'bow':
            case 'sns':
            case 'db':
            case 'dbs':
              return 0.35
            case 'gs':
              return 0.30
            default:
              return 0.25
          }
        case 'mhworld':
        case 'default':
          return 0.25
      }
    } else {
      return 0
    }
  }

}

module.exports = MHSet