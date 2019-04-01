class DamageCalculator {
  constructor (weapon, skills, monster,) {
    this.weapon = weapon
    this.skills = skills
    this.monster = monster
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

    let _totAff = wpTotalAff()
    let _totRaw = wpRaw + wpAddRaw

    if (this.weapon.nullRaw === true && this.weapon.rawMotionValue === 100 && this.weapon.eleMotionValue !== 0) {
      _totRaw = 0 
    }
    
    let dmgString = 
      `${wpMult} * ${wpSharpMult} * (${wpRaw} + ${wpAddRaw}) * (1 + ${_totAff/100} * ${skAffMod})${_strWpRawMults()} * ${wpMV/100} * ${mRawHZ/100}`
    if (debug) { console.log(dmgString) }
    let dmg = parseFloat(wpMult * wpSharpMult * _totRaw * (1 + _totAff/100 * skAffMod) * wpRawMults * wpMV/100 * mRawHZ/100)
    return dmg
    }

  _EleCalculations(debug = false) {
    let wepEle = Math.floor(this.weapon.calcWpElement(this.skills))
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

  effectiveDmgCalc(debug = false) {
    let wpHits = this.weapon.hits
    switch (debug) {
      case true:
        if (this.monster.rawHitzone === 100) { return {'type': 'Effective raw', 'dmg': this._EleCalculations(true) * wpHits + this._rawCalculations(true)} }
        else { return {'type': 'Effective raw', 'dmg': Math.floor(Math.floor(this._EleCalculations(true) * wpHits + this._rawCalculations(true)) * this.monster.globalDefMod)} }
      case false:
      if (this.monster.rawHitzone === 100) { return {'type': 'Effective raw', 'dmg': this._EleCalculations() * wpHits + this._rawCalculations()} }
      else { return {'type': 'Effective raw', 'dmg': Math.floor(Math.floor(this._EleCalculations() * wpHits + this._rawCalculations()) * this.monster.globalDefMod)} }
    }
  }
}

module.exports = DamageCalculator