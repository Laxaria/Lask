class CLIParser {
  constructor() {
    this.maxArray = 20
    this.quit = false
    this.errmsg = ""
  };

  parseError(errmsg) {
    this.quit = true
    this.errmsg = errmsg
    return
  }

  rawParse(string) {
    let raw = string.match(/\d{2,3}/)
    if (raw === null) {
      this.parseError("Unable to parse raw value of weapon")
      return
    } 
    else if (raw !== null) {
      if (raw[0].length === 3) {
        return parseInt(raw[0])
      }
    }
  }

  affParse(string) {
    let aff = string.match(/\d?.?\d{1,3}/)
    if (aff === null) {
      this.parseError("Unable to parse affinity value of weapon")
    } 
    else if (aff !== null) {
      aff = parseFloat(aff)
      if (aff <= 1) {
        aff = aff * 100
        return parseInt(aff)
      } else if (aff > 1 && aff <= 100) {
        return parseInt(aff)
      } else {
        this.parseError("Unable to parse affinity value of weapon")
        return
      }
    }
  }

  auxParse(string) {
    let atkSkill = string.toLowerCase().match(/(au([sml]))/)
    if (atkSkill === null) {
      this.parseError("Unable to parse AuX skill. Acceptable values are AuS/AuM/AuL.")
      return
    }
    else if (atkSkill !== null) {
      switch (atkSkill[2]) {
        case 's':
          return 10
        case 'm':
          return 15
        case 'l':
          return 20
        default:
          this.parseError("Unable to parse AuX skill. Acceptable values are AuS/AuM/AuL.")
          break
      }
    }
  }

  rawMultParse(string) {
    let rawMult = string.match(/x?(\d{1}.\d{1,2})x?/)
    if (rawMult === null) {
      this.parseError("Unable to parse raw multiplier")
      return
    }
    else if (rawMult !== null) {
      return parseFloat(rawMult[1])
    }
  }

  affSkillParse(string) {
    let availRanks = [1, 2, 3]
    let affSkill = string.toLowerCase().match(/ce\+?(\d)/)
    if (affSkill === null) {
      this.parseError("Unable to parse CE skill")
      return
    } else {
      let affGainRank = parseInt(affSkill[1])
      if (availRanks.includes(affGainRank)) {
        return affGainRank * 10
      } else {
        this.parseError("CE Rank greater than 3")
        return
      }
    }
  }

  parser(cliString, weapon, skills) {
    let _data = cliString.split(",")
    if (_data.length > this.maxArray) {
      this.quit = true 
      this.errmsg = "Data longer than tolerated max length"
      return
    }
    for (let i = 0; i < _data.length; i++) {
      if (this.quit !== false) { break }
      
      let _value = _data[i].trim()
      
      if (_value.toLowerCase().includes('raw') && weapon.raw === 0) {
        weapon.raw = this.rawParse(_value)
      } 

      else if (_value.toLowerCase().includes('raw') && _value.toLowerCase().includes('x')) {
        skills.rawMult = skills.rawMult * this.rawMultParse(_value)
      }
      
      else if (_value.toLowerCase().includes('aff') && weapon.affinity === 0) {
        weapon.affinity = this.affParse(_value)
      } 
      
      else if (_value.toUpperCase() === 'WE') {
        skills.WE = true
      } 
      
      else if (_value.toUpperCase() === 'CB') {
        skills.CB = true
      } 
      
      else if (_value.toLowerCase().includes('au')) {
        skills.addRaw = skills.addRaw + this.auxParse(_value)
      }

      else if (_value.toLowerCase().includes('ce')) {
        skills.addAff = skills.addAff + this.affSkillParse(_value)
      }
    }
  }
}

export { CLIParser }