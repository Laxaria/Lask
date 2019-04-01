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
    this.game
    this.damageCalculator = new DamageCalculator(this.weapon, this.skills, this.monster)
  }

  parseString(cliString) {
    cliString = cliString.toLowerCase().trim()
    
    if (cliString.includes('mhgu')) { this.game = 'mhgu' }
    else if (cliString.includes('mhworld')) { this.game = 'mhworld' }

    if (cliString.slice(-1) === ',') {
      cliString = cliString.slice(0, cliString.length -1)
    }

    this.parser.parse(cliString, this.weapon, this.skills, this.monster)
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
    if (this.parser.quit) { return this.parser.errmsg }
    else { return this.damageCalculator.effectiveDmgCalc(debug) }
  }
}

module.exports = Lask
