const sharpConstantsRaw = {
  'purple': 1.39,
  'white': 1.32,
  'blue': 1.20,
  'green': 1.05,
  'yellow': 1.00,
  'orange': 0.75,
  'red': 0.50
}

const sharpConstantsEle = {
  'purple': 1.2,
  'white': 1.125,
  'blue': 1.0625,
  'green': 1,
  'yellow': 0.75,
  'orange': 0.50,
  'red': 0.25
}
class Weapon {
  constructor () {
    this.name = ''
    this.affinity = 0
    this.sharp

    this.raw = 0
    this.rawMotionValue = null
    this.rawMult = 1.0
    this.sharpRaw = 1.0

    this.element = 0
    this.sharpEle = 1.0
    this.eleCritMult = 0
    this.eleMotionValue = 0

    this.nullRaw = false

    this.hits = 1
  }
  get rawMV () {
    if (this.rawMotionValue === null) {return 100} else {return this.rawMotionValue}
  }

  sharpMods(color) {
    if (!this.sharp) {
      this.sharp = color
      this.sharpRaw = sharpConstantsRaw[color]
      this.sharpEle = sharpConstantsEle[color]
    }
  }

  bowgunElement(game, sk) {
    switch (this.name) {
      case 'lbg':
      case 'hbg':
        if (game === 'mhgu') {sk.eleMult.push(0.95)}
        this.element = this.raw + sk.addRaw
        this.nullRaw = true
        break
      default:
        break
    }
  }

  calcWpElement(game, sk) {
    this.bowgunElement(game, sk)
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
    } else { 
      return wpElement
    }
  }
}

module.exports = Weapon