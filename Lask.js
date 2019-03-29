const Weapon = require("./models/weapon")
const CLIParser = require("./models/parser")
const Skills = require("./models/skills")
const Monster = require("./models/monster")

class Lask {
  constructor (cliString) {
    this.cliString = cliString.toLowerCase()
    this.weapon = new Weapon()
    this.skills = new Skills()
    this.parse = new CLIParser()
    this.monster = new Monster()
    this.parse.parse(this.cliString, this.weapon, this.skills, this.monster)
  }

  weaponStats() {
    let output = {
      "raw": this.weapon.raw + this.skills.addRaw,
      "ele": this.weapon.element,
      "affinity": this.weapon.affinity,
      "crit boost": this.skills.CB,
      "raw mults": this.skills.rawMult,
      "add affinity": this.skills.addAff,
      "monster raw hitzone": this.monster.rawHitzone,
      "monster element hitzone": this.monster.eleHitzone,
      "weapon mult": this.weapon.weaponMult,
      'weapon ele crit': this.weapon.eleCritMult
    }
    return output
  }

  _effRawCalc(debug = true) {
    let raw = this.weapon.raw
    let addRaw = this.skills.addRaw
    let wepAff = this.weapon.affinity
    let wepMV = this.weapon.rawMotionValue
    let wepMult = this.weapon.weaponMult

    let addAff = this.skills.addAff
    let affMod = this.skills.critMod()
    let rawMult = this.skills.getRawMult()
    let stringRawMult = '* ' + this.skills.rawMult.join(' * ')

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

    let damageCalcString = `${wepMult} * (${raw} + ${addRaw}) * (1 + ${totalAff()/100} * ${affMod}) ${stringRawMult} * ${monsterRawHZ/100} * ${wepMV/100} * ${this.monster.globalDefMod}`
    if (debug === true) {
      console.log(damageCalcString)
    }
    return parseFloat((wepMult * (raw + addRaw) * (1 + totalAff()/100 * affMod) * rawMult * monsterRawHZ/100 * wepMV/100).toPrecision(6))
  }

  _effEleCalc(debug = true) {
    let wepEle = this.weapon.element
    let wepEleCritMult = this.weapon.eleCritMult

    let eleHZ = this.monster.eleHitzone
    let totalAff = () => {
      let _totalAff = this.skills.addAff + this.weapon.affinity
      if (this.monster.rawHitzone >= 45 && this.skills.WE === true) {
        _totalAff += 50
      }
      if (_totalAff >= 100) {
        _totalAff = 100
      }
      return _totalAff
    }

    let eleDmgString = `${wepEle} * (1 + ${totalAff()/100} * ${wepEleCritMult}) * ${eleHZ/100}`
    if (debug) {
      console.log(eleDmgString)
    }
    let result = wepEle * (1 + totalAff()/100 * wepEleCritMult) * eleHZ/100
    return result
  }

  effectiveRawCalc(dmgOnly = false) {
    if (this.parse.quit === true) {
      return this.parse.errmsg
    } 
    if (dmgOnly === true) {
      if (this.monster.rawHitzone === 100) {
        return this._effRawCalc(false) + this._effEleCalc(false)
      } else if (this.monster.rawHitzone !== 100) {
        return Math.floor(Math.floor(this._effRawCalc(false) + this._effEleCalc(false)) * this.monster.globalDefMod)
      }
    } else if (dmgOnly === false) {
        if (this.monster.rawHitzone === 100) {
          return `Effective Raw: ${this._effRawCalc()}`
        } else if (this.monster.rawHitzone !== 100) {
          return `Effective Damage: ${Math.floor(Math.floor(this._effRawCalc()) * this.monster.globalDefMod)}`
        }
    }
  }
}

module.exports = Lask
