const Weapon = require("./models/weapon")
const CLIParser = require("./models/parser")
const Skills = require("./models/skills")
const Monster = require("./models/monster")

class DamageCalculator {
  constructor (cliString) {
    this.cliString = cliString
    this.weapon = new Weapon()
    this.skills = new Skills()
    this.parse = new CLIParser()
    this.monster = new Monster()
    this.parse.parser(this.cliString, this.weapon, this.skills, this.monster)
  }

  weaponStats() {
    let output = {
      "raw": this.weapon.raw + this.skills.addRaw,
      "affinity": this.weapon.affinity,
      "crit boost": this.skills.CB,
      "raw mults": this.skills.rawMult,
      "add affinity": this.skills.addAff,
      "monster raw hitzone": this.monster.rawHitzone,
      "monster element hitzone": this.monster.elmHitzone
    }
    return output
  }

  _effRawCalc() {
    let raw = this.weapon.raw
    let addRaw = this.skills.addRaw
    let wepAff = this.weapon.affinity
    let wepMV = this.weapon._motionValue

    let addAff = this.skills.addAff
    let affMod = this.skills.critMod()
    let rawMult = this.skills.rawMult

    let monsterRawHZ = this.monster.rawHitzone

    let totalAff = () => {
      let _totalAff = addAff + wepAff
      if (monsterRawHZ >= 45 && this.skills.WE === true) {
        _totalAff += 50
      }
      if (_totalAff >= 100) {
        _totalAff = 100
      }
      return _totalAff
    }

    let damageCalcString = `(${raw} + ${addRaw}) * (1 + ${totalAff()/100} * ${affMod}) * ${rawMult} * ${monsterRawHZ/100} * ${wepMV}`
    console.log(damageCalcString)
    return ((raw + addRaw) * (1 + totalAff()/100 * affMod) * rawMult * monsterRawHZ/100 * wepMV).toPrecision(6)
  }

  effectiveRawCalc() {
    if (this.parse.quit === true) {
      return this.parse.errmsg
    } else {
      if (this.monster.rawHitzone === 100) {
        return `Effective Raw: ${this._effRawCalc()}`
      } else if (this.monster.rawHitzone !== 100) {
        return `Effective Damage: ${Math.floor(this._effRawCalc())}`
      }
    }
  }
}

module.exports = DamageCalculator
