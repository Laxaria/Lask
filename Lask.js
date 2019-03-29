const Weapon = require("./models/weapon")
const CLIParser = require("./models/parser")
const Skills = require("./models/skills")
const Monster = require("./models/monster")

class Lask {
  constructor () {
    this.weapon = new Weapon()
    this.skills = new Skills()
    this.parser = new CLIParser()
    this.monster = new Monster()
  }

  parseString(cliString) {
    this.parser.parse(cliString.toLowerCase().trim(), this.weapon, this.skills, this.monster)
  }

  weaponStats() {
    // let output = {
    //   "raw": this.weapon.raw + this.skills.addRaw,
    //   "ele": this.weapon.calcWpElement(this.skills),
    //   "affinity": this.weapon.affinity,
    //   "crit boost": this.skills.CB,
    //   "raw mults": this.skills.rawMult,
    //   "add affinity": this.skills.addAff,
    //   "monster raw hitzone": this.monster.rawHitzone,
    //   "monster element hitzone": this.monster.eleHitzone,
    //   "weapon mult": this.weapon.rawMult,
    //   'weapon eleMult': this.weapon.eleMult,
    //   'weapon ele crit': this.weapon.eleCritMult
    // }
    let output = this
    return output
  }

  _rawCalculations (debug = false) {
    let wpRaw = this.weapon.raw
    let wpAddRaw = this.skills.addRaw
    let wpAff = this.weapon.affinity
    let wpAddAff = this.skills.addAff
    let wpMV = this.weapon.rawMotionValue
    let wpMult = this.weapon.rawMult
    let wpSharpMult = this.weapon.sharpRaw
    let skAffMod = this.skills.critMod()
    let wpRawMults = this.skills.getRawMult()
    let mRawHZ = this.monster.rawHitzone

    let wpTotalAff = () => {
      let _totalAff = wpAff + wpAddAff
      if (mRawHZ >= 45 && this.skills.WE === true) {
        _totalAff += 50
      }
      if (_totalAff > 100) {
        _totalAff = 100
      }
      return _totalAff
    }

    let _strWpRawMults = () => {
      let _skRawMult = this.skills.rawMult
      if (_skRawMult.length === 0) {
        return ''
      } else {
        return ' * ' + _skRawMult.join(' * ')
      }
    }

    let _totRaw = wpRaw + wpAddRaw
    if (this.weapon.nullRaw === true && this.weapon.rawMotionValue === 100) {
      _totRaw = 0 
    }
    let _totAff = wpTotalAff()
    
    let dmgString = 
      `${wpMult} * ${wpSharpMult} * ${_totRaw} * (1 + ${_totAff/100} * ${skAffMod})${_strWpRawMults()} * ${wpMV/100} * ${mRawHZ/100}`
    if (debug) {
      console.log(dmgString)
    }
    let dmg = parseFloat(wpMult * wpSharpMult * _totRaw * (1 + _totAff/100 * skAffMod) * wpRawMults * wpMV/100 * mRawHZ/100)
    return dmg
  }

  _effEleCalc(debug = true) {
    let wepEle = this.weapon.calcWpElement(this.skills)
    let wepEleCritMult = this.weapon.eleCritMult
    let wepSharpEleMod = this.weapon.sharpEle
    let eleMults = this.skills.getEleMult()

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

    let eleDmgString = `${wepSharpEleMod} * ${wepEle} * (1 + ${totalAff()/100} * ${wepEleCritMult}) * ${eleMults} * ${eleHZ/100}`
    if (debug) {
      console.log(eleDmgString)
    }
    let result = wepSharpEleMod * wepEle * (1 + totalAff()/100 * wepEleCritMult) * eleMults * eleHZ/100
    return parseFloat(result)
  }

  effectiveDmgCalc(dmgOnly = false) {
    if (this.parser.quit === true) {
      return this.parser.errmsg
    } 
    if (dmgOnly === true) {
      if (this.monster.rawHitzone === 100) {
        return this._effEleCalc(true) + this._rawCalculations(true)
      } else if (this.monster.rawHitzone !== 100) {
        return Math.floor(Math.floor(this._effEleCalc(true) + this._rawCalculations(true)) * this.monster.globalDefMod)
      }
    } else if (dmgOnly === false) {
        if (this.monster.rawHitzone === 100) {
          return `Effective Damage:  ${this._effEleCalc() + this._rawCalculations()}`
        } else if (this.monster.rawHitzone !== 100) {
          return `Effective Damage: ${Math.floor(Math.floor(this._effEleCalc() + this._rawCalculations()) * this.monster.globalDefMod)}`
        }
    }
  }
}

module.exports = Lask
