const CLIParser = require('./models/parser')
const DamageCalculator = require('./models/DamageCalculator')
const MHSet = require('./models/MHSet')

class Lask {
  constructor () {
    this.parser = new CLIParser()
    this.mhSet = new MHSet()
    this.game = null
    this._outputGame = null
  }

  __game (cliString) {
    if (cliString.includes('mhgu')) {
      this._outputGame = 'mhgu'
      this.game = 'mhgu'
    } else if (cliString.includes('mhworld')) {
      this._outputGame = 'mhworld'
      this.game = 'mhworld'
    } else {
      this._outputGame = 'Game not indicated. Assumed MHGU.'
      this.game = 'mhgu'
    }
    this.mhSet.game = this.game
  }

  parseString (cliString) {
    let _string = cliString.toLowerCase().trim()
    this.__game(_string)
    if (_string.slice(-1) === ',') {
      _string = _string.slice(0, _string.length - 1)
    }
    this.parser.parse(_string, this.mhSet.data)
  }

  error () {
    if (this.parser.error instanceof Error) { return true } else { return false }
  }

  errorMessage () {
    if (this.parser.error instanceof Error) { return this.parser.error.message }
  }

  weaponStats () {
    let output = this.mhSet
    return output
  }

  effectiveDmgCalc (debug = false) {
    let damageCalculator = new DamageCalculator(this.game, this.mhSet)
    if (this.parser.error instanceof Error) {
      return this.parser.error
    } else {
      let output = damageCalculator.effectiveDmgCalc(debug)
      if (this.mhSet.errors instanceof Error) { return this.mhSet.errors }
      // console.log(this.mhSet.assumptions)
      return output
    }
  }
}

module.exports = Lask
