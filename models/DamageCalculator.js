class DmgCalcOutput {
  constructor (game, type, rawDmg, rawDmgString, eleDmg, eleDmgString, totalDmg, ...args) {
    this.game = game
    this.damageClassification = type
    this.totalDamage = totalDmg
    this.rawDamage = rawDmg
    this.rawDamageString = rawDmgString
    this.eleDamage = eleDmg
    this.eleDamageString = eleDmgString
    this.assumptions = args[0]
  }
}

class DamageCalculator {
  constructor (game, mhSet) {
    this.game = game
    this.mhSet = mhSet
    this._rawDmgString = null
    this._eleDmgString = null
  }

  _rawCalculations (debug = false) {
    let wpRaw = this.mhSet.weaponRaw
    let wpAddRaw = this.mhSet.additionalRaw
    let wpTotalRaw = this.mhSet.weaponTotalRaw
    let wpTotalAff = this.mhSet.weaponTotalAffinity
    let wpMV = this.mhSet.weaponRawMV
    let wpMult = this.mhSet.weaponRawModifier
    let wpSharpMult = this.mhSet.weaponSharpMod.raw
    let skAffMod = this.mhSet.critModifier
    let wpRawMults = this.mhSet.rawMultipliers
    let mRawHZ = this.mhSet.monsterRawHitzone
    let _strWpRawMults = this.mhSet.stringWeaponRawMult
    let dmgString = `${wpMult} * ${wpSharpMult} * (${wpRaw} + ${wpAddRaw}) * (1 + ${wpTotalAff / 100} * ${skAffMod})${_strWpRawMults} * ${wpMV / 100} * ${mRawHZ / 100}`

    if (debug) { console.log(dmgString) }
    this._rawDmgString = dmgString

    let dmg = parseFloat(wpMult * wpSharpMult * wpTotalRaw * (1 + wpTotalAff / 100 * skAffMod) * wpRawMults * wpMV / 100 * mRawHZ / 100)

    if (this.mhSet.dontCalcRawDamage === true) { return 0 } else { return dmg }
  }

  _EleCalculations (debug = false) {
    let wepEle = this.mhSet.weaponElement
    let wepEleCritMult = this.mhSet.eleCritModifier
    let wepSharpEleMod = this.mhSet.weaponSharpMod.element
    let wepEleMV = this.mhSet.weaponEleMV
    let eleMults = this.mhSet.eleMultipliers
    let eleHZ = this.mhSet.monsterEleHitzone
    let totalAff = this.mhSet.weaponTotalAffinity

    let eleDmgString = `${wepSharpEleMod} * ${wepEle} * (1 + ${totalAff / 100} * ${wepEleCritMult}) * ${eleMults} * ${wepEleMV / 100} * ${eleHZ / 100}`
    if (debug) { console.log(eleDmgString) }
    this._eleDmgString = eleDmgString

    let result = parseFloat(wepSharpEleMod * wepEle * (1 + totalAff / 100 * wepEleCritMult) * eleMults * wepEleMV / 100 * eleHZ / 100)
    return result
  }

  effectiveDmgCalc (debug = false) {
    let wpHits = this.mhSet.weaponHits
    let eleDamage = Math.floor(this._EleCalculations(debug))
    let rawDamage = Math.floor(this._rawCalculations(debug))
    let totalDmg = Math.floor((rawDamage + eleDamage * wpHits) * this.mhSet.monsterDefMod)
    let damageClass
    if (this.mhSet.monsterRawHitzone === 100 && this.mhSet.monsterEleHitzone === 100) {
      damageClass = 'Effective Raw/Element'
    } else {
      damageClass = 'Effective Damage'
    }
    let output = new DmgCalcOutput(this.game, damageClass, rawDamage, this._rawDmgString, eleDamage, this._eleDmgString, totalDmg, this.mhSet.assumptions)
    return output
  }
}

module.exports = DamageCalculator
