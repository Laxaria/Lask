import { Weapon } from "./models/weapon.js"
import { CLIParser } from "./models/parser.js"
import { Skills } from "./models/skills.js"

class damageCalculator {
  constructor (cliString) {
    this.cliString = cliString
    this.weapon = new Weapon()
    this.skills = new Skills()
    this.parse = new CLIParser()
    this.parse.parser(this.cliString, this.weapon, this.skills)
  }

  weaponStats() {
    let output = {
      "raw": this.weapon.raw + this.skills.addRaw,
      "affinity": this.weapon.affinity,
      "crit boost": this.skills.CB
    }
    return output
  }

  _effRawCalc() {
    let raw = this.weapon.raw
    let addRaw = this.skills.addRaw
    let totalAff = () => {
      if (this.weapon.affinity > 100) {
        return 100
      } else {
        return this.weapon.affinity
      }
    }
    let affMod = this.skills.critMod()

    return ((raw + addRaw) * (1 + totalAff()/100 * affMod)).toPrecision(6)

  }

  effectiveRawCalc() {
    if (this.parse.quit === true) {
      return this.parse.errmsg
    } else {
      return this._effRawCalc()
    }
  }
}

export { damageCalculator }