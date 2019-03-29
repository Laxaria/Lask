class Skills {
  constructor () {
    this.CB = false
    this.WE = false
    this.addRaw = 0
    this.addAff = 0
    this.rawMult = []

  }
  critMod() {
    if (this.CB === false) {
      return 0.25
    } else if (this.CB === true) {
      return 0.40
    } else {
      return 0.25
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
}

module.exports = Skills