class Skills {
  constructor () {
    this.CB = false
    this.WE = false
    this.addRaw = 0
    this.addAff = 0
    this.rawMult = 1
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
}

export { Skills }