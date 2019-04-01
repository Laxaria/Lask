class Weapon {
  constructor () {
    this.name = ''
    this.affinity = 0

    this.raw = 0
    this.rawMotionValue = 100
    this.rawMult = 1.0
    this.sharpRaw = 1.0

    this.element = 0
    this.sharpEle = 1.0
    this.eleCritMult = 0
    this.eleMotionValue = 0

    this.nullRaw = false

    this.hits = 1
  }

  bowgunElement (sk) {
      if (this.name === 'lbg' || this.name === 'hbg') {
        sk.eleMult.push(0.95)
        this.element = this.raw + sk.addRaw
        this.nullRaw = true
      }
  }

  calcWpElement (sk) {
    this.bowgunElement(sk)
    let wpElement = parseInt(this.element)
    let wpMults = 1
    if (sk.elemental) {
      wpMults += 0.1
    }
    switch (sk.eleAttack) {
      case 1:
        wpMults += 0.05
        wpElement = Math.floor(wpElement * wpMults) + 4
        break
      case 2:
        wpMults += 0.1
        wpElement = Math.floor(wpElement * wpMults) + 6
        break
      default:
        break
    }
    if (this.name === 'lbg' || this.name === 'hbg') {
      return parseFloat(wpElement * this.eleMotionValue/100)
    } else { return wpElement }
  }
}

module.exports = Weapon