class DmgCalcOutput {
  constructor (game, type, rawDmg, rawDmgString, eleDmg, eleDmgString, totalDmg, ...args) {
    this.game = game
    this.type = type
    this.totalDamage = totalDmg
    this.rawDamage = rawDmg
    this.rawDamageString = rawDmgString
    this.eleDamage = eleDmg
    this.eleDamageString = eleDmgString
    let _assumptions = []
    switch (args.length) {
      case 0:
        break
      default:
        for (let e of args[0].entries()) {
          _assumptions.push(`(${e[0]+1}) ${e[1]}`)
        }
        break
    }
    this.assumptions = `${_assumptions.join(' ')}`
  }
}

class DamageCalculator {
  constructor (game, weapon, skills, monster) {
    this.game = game
    this.weapon = weapon
    this.skills = skills
    this.monster = monster
    this._rawDmgString
    this._eleDmgString
  }

  _rawCalculations (debug = false) {
    let wpRaw = this.weapon.raw
    let wpAddRaw = this.skills.addRaw
    let wpAff = this.weapon.affinity
    let wpAddAff = this.skills.addAff
    let wpMV = this.weapon.rawMV
    let wpMult = this.weapon.rawMult
    let wpSharpMult = this.weapon.sharpRaw
    let skAffMod = this.skills.critMod()
    let wpRawMults = this.skills.getRawMult()
    let mRawHZ = this.monster.rawHitzone

    let wpTotalAff = () => {
      let _totalAff = this.skills.addAff + this.weapon.affinity
      if (this.monster.rawHitzone >= 45) {
        _totalAff += this.skills.weMod()
      }
      if (_totalAff >= 100) {
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

    if (this.weapon.nullRaw === true && this.weapon.rawMotionValue === 100 && this.weapon.eleMotionValue !== 0) {
      _totRaw = 0 
    }
    
    let dmgString = 
      `${wpMult} * ${wpSharpMult} * (${wpRaw} + ${wpAddRaw}) * (1 + ${wpTotalAff()/100} * ${skAffMod})${_strWpRawMults()} * ${wpMV/100} * ${mRawHZ/100}`
    if (debug) { console.log(dmgString) }
    this._rawDmgString = dmgString
    let dmg = parseFloat(wpMult * wpSharpMult * _totRaw * (1 + wpTotalAff()/100 * skAffMod) * wpRawMults * wpMV/100 * mRawHZ/100)
    if (this.weapon.nullRaw && wpMV === null) { return 0 } else { return dmg }
    }

  _EleCalculations(debug = false) {
    let wepEle = Math.floor(this.weapon.calcWpElement(this.game, this.skills))
    let wepEleCritMult = this.weapon.eleCritMult
    let wepSharpEleMod = this.weapon.sharpEle
    let eleMults = this.skills.getEleMult()

    let eleHZ = this.monster.eleHitzone

    let totalAff = () => {
      let _totalAff = this.skills.addAff + this.weapon.affinity
      if (this.monster.rawHitzone >= 45) {
        _totalAff += this.skills.weMod()
      }
      if (_totalAff >= 100) {
        _totalAff = 100
      }
      return _totalAff
    }

    let eleDmgString = `${wepSharpEleMod} * ${wepEle} * (1 + ${totalAff()/100} * ${wepEleCritMult}) * ${eleMults} * ${eleHZ/100}`
    if (debug) { console.log(eleDmgString)}
    this._eleDmgString = eleDmgString
    let result = wepSharpEleMod * wepEle * (1 + totalAff()/100 * wepEleCritMult) * eleMults * eleHZ/100
    return parseFloat(result)
  }
  assumptionsLogger() {
    let assumptions = []
    let bowguns = ['lbg', 'hbg']
    let assumeWps = ['sns', 'gs', 'ls'].concat(bowguns)
    if (this.monster.rawHitzone === 100) {assumptions.push('Monster had a 100 raw hitzone.')}
    if (this.weapon.rawMotionValue === null && !this.weapon.nullRaw) {assumptions.push('Weapon\'s raw motion value was 100.')}
    if (assumeWps.includes(this.weapon.name)) {assumptions.push(`Added weapon-specific multiplier of ${this.weapon.rawMult} for raw damage.`)}
    if (!this.weapon.sharp && !bowguns.includes(this.weapon.name)) {assumptions.push('A sharpness multiplier of 1.0x for raw and element was used as no weapon sharpness was indicated.')}
    if (this.monster.globalDefMod === 1) {assumptions.push('Quest defense modifier for monster is 1.0x.')}
    if (this.weapon.nullRaw && this.weapon.rawMV === 1.00) {assumptions.push('No raw damage dealt.')}
    return assumptions
  }

  effectiveDmgCalc(debug = false) {
    let wpHits = this.weapon.hits
    let rawDamage = Math.floor(this._rawCalculations(debug))
    let eleDamage = Math.floor(this._EleCalculations(debug))
    let totalDmg = Math.floor((rawDamage + eleDamage * wpHits) * this.monster.globalDefMod)
    let type
    switch (this.monster.rawHitzone) {
      case 100:
        type = 'Effective Raw'
        break
      default:
        type = 'Effective damage'
        break
    }
    let output = new DmgCalcOutput(this.game, type, rawDamage, this._rawDmgString, eleDamage, this._eleDmgString, totalDmg, this.assumptionsLogger())
    return output
  }
}

module.exports = DamageCalculator