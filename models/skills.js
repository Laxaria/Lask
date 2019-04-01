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
  critMod() {
    if (this.CB === false) {
      return 0.25
    } else if (this.CB === true) {
      return 0.40
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