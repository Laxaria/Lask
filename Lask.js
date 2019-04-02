const Weapon = require('./models/weapon')
const CLIParser = require('./models/parser')
const Skills = require('./models/skills')
const Monster = require('./models/monster')
const DamageCalculator = require('./models/DamageCalculator')
const MHSet = require('./models/MHSet')

class Lask {
  constructor () {
    this.weapon = new Weapon()
    this.skills = new Skills()
    this.monster = new Monster()
    this.parser = new CLIParser()
    this.mhSet
    this.game
    this._game
  }

  __game(cliString) {
    if (cliString.includes('mhgu')) { this._game = 'mhgu' }
    else if (cliString.includes('mhworld')) { this._game = 'mhworld' }
    else { this._game = 'Game not indicated. Assumed MHGU.' }

    if (cliString.includes('mhgu')) { this.game = 'mhgu' }
    else if (cliString.includes('mhworld')) { this.game = 'mhworld' }
    else { this.game = 'mhgu' }
  }

  _createMHSet(game, weapon, skills, monster) {
    this.mhSet = new MHSet(game, weapon, skills, monster)
  }

  parseString(cliString) {
    cliString = cliString.toLowerCase().trim()
    this.__game(cliString)

    if (cliString.slice(-1) === ',') {
      cliString = cliString.slice(0, cliString.length -1)
    }
    this._createMHSet(this.game, this.weapon, this.skills, this.monster)
    
    this.parser.parse(cliString, this.mhSet.data)
    
  }

  error() {
    if (this.parser.error instanceof Error) { return true }
  }

  errorMessage() {
    if (this.parser.error instanceof Error) { return this.parser.error.message }
  }

  weaponStats() {
    // let output = {
    //   'raw': this.weapon.raw + this.skills.addRaw,
    //   'ele': this.weapon.calcWpElement(this.skills),
    //   'affinity': this.weapon.affinity,
    //   'crit boost': this.skills.CB,
    //   'raw mults': this.skills.rawMult,
    //   'add affinity': this.skills.addAff,
    //   'monster raw hitzone': this.monster.rawHitzone,
    //   'monster element hitzone': this.monster.eleHitzone,
    //   'weapon mult': this.weapon.rawMult,
    //   'weapon eleMult': this.weapon.eleMult,
    //   'weapon ele crit': this.weapon.eleCritMult
    // }
    let output = this
    return output
  }

  effectiveDmgCalc(debug = false) {
    let damageCalculator = new DamageCalculator(this._game, this.mhSet)
    if (this.parser.error instanceof Error) { return this.parser.error }
    else { 
      let output = damageCalculator.effectiveDmgCalc(debug) 
      if (debug) {console.log(output)}
      return output
    }
  }
}

module.exports = Lask
