class Skills {
  constructor () {
    this.addRaw = 0
    this.addAff = 0

    this.CB = false
    this.WE = false

    this.rawMult = []
    
    this.eleMult = []
    this.eleAttack = 0
    this.elemental = false
  }
  weMod() {
    switch (this.WE) {
      case 1:
        return 15
      case 2:
        return 30
      case 3:
      case true:
        return 50
      case false:
        return 0
      default:
        return 'Parser error'
    }
  }
  critMod() {
    switch (this.CB) {
      case 1:
        return 0.30
      case 2:
        return 0.35
      case 3:
      case true:
        return 0.40
      case false:
        return 0.25
      default:
        return 'Parser error'
    }
  }
  getRawMult() {
    let multiplier = 1.0
    if (this.rawMult.length === 0) {
      return multiplier
    } else {
      this.rawMult.forEach ( (i) => {
        multiplier *= i
      })
      return multiplier
    }
  }
  getEleMult() {
    let multiplier = 1.0
    if (this.eleMult.length === 0) {
      return multiplier
    } else {
      this.eleMult.forEach( (i) => {
        multiplier *= i
      })
    } return multiplier
  }
}

module.exports = Skills