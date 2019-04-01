const Weapon = require('./models/weapon')
const CLIParser = require('./models/parser')
const Skills = require('./models/skills')
const Monster = require('./models/monster')
const DamageCalculator = require('./models/DamageCalculator')

class Lask {
  constructor () {
    this.weapon = new Weapon()
    this.skills = new Skills()
    this.monster = new Monster()
    this.parser = new CLIParser()
  }

  parseString(cliString) {
    cliString = cliString.toLowerCase().trim()

    if (cliString.includes('mhgu')) { this.game = 'mhgu' }
    else if (cliString.includes('mhworld')) { this.game = 'mhworld' }
    else { this.game = 'Game not indicated' }

    if (cliString.slice(-1) === ',') {
      cliString = cliString.slice(0, cliString.length -1)
    }

    this.parser.parse(cliString, this.weapon, this.skills, this.monster)
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
    return output['damageCalculator']
  }

  effectiveDmgCalc(debug = false) {
    let damageCalculator = new DamageCalculator(this.game, this.weapon, this.skills, this.monster)
    if (this.parser.error instanceof Error) { return this.parser.error }
    else { 
      let output = damageCalculator.effectiveDmgCalc(debug) 
      console.log(output)
      return output
    }
  }
}

module.exports = Lask
