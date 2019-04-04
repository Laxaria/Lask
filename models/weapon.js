class Weapon {
  constructor () {
    this.type = ''
    this.affinity = 0
    this.sharp = null

    this.raw = 0
    this.rawMotionValue = null
    this.rawMult = null
    this.sharpRaw = 1.0

    this.element = 0
    this.sharpEle = 1.0
    this.eleCritMult = false
    this.eleMotionValue = null

    this.hits = 1
    this.nullRaw = false
  }
}

module.exports = Weapon
