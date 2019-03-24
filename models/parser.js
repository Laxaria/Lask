class CLIParser {
  constructor() {
    this.maxArray = 20
    this.quit = false
    this.errmsg = ""
  };

  rawParse(string) {
    let err = false
    let raw = string.match(/\d{2,3}/)
    if (raw !== null) {
      if (raw[0].length === 3) {
        return parseInt(raw[0])
      } else {
        err = true
      }
    } else {
      err = true
    }
    if (err === true) {
      this.quit = true
      this.errmsg = "Unable to parse raw value of weapon"
      return
    }
  }

  affParse(string) {
    let err = false
    let aff = string.match(/\d?.?\d{1,3}/)
    if (aff !== null) {
      aff = parseFloat(aff)
      if (aff <= 1) {
        aff = aff * 100
        return parseInt(aff)
      } else if (aff > 1 && aff <= 100) {
        return parseInt(aff)
      } else {
        err = true
      }
    } else {
      err = true
    }
    if (err === true) {
      this.quit = true
      this.errmsg = "Unable to parse affinity value of weapon"
      return
    }
  }

  auxParse(string) {
    let err = false
    let atkSkill = string.toLowerCase().match(/(au([sml]))/)
    if (atkSkill !== null) {
      switch (atkSkill[2]) {
        case 's':
          return 10
        case 'm':
          return 15
        case 'l':
          return 20
        default:
          err = true
      }
    }
    if (err === true) {
      this.quit = true
      this.errmsg = "Failed to parse AuX skills"
      return
    }
  }

  rawMultParse(string) {
    let err = false
    let rawMult = string.match(/x?(\d{1}.\d{1})x?/)
    if (rawMult !== null) {
      return parseFloat(rawMult[1])
    } else {
      err = true
    }
    if (err === true) {
      this.quit = true
      this.errmsg = "Failed to parse raw multiplier"
    }
  }

  parser(cliString, weapon, skills) {
    let _data = cliString.split(';')
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

      else if (_value.toLowerCase().includes('raw' && _value.toLowerCase().includes('x'))) {
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
    }
  }
}

export { CLIParser }