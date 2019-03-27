const nearley = require('nearley')
const grammar = require('../grammar/grammar')

class CLIParser {
  constructor() {
    this.maxArray = 20
    this.quit = false
    this.errmsg = '0'
  };

  parser(cliString, weapon, skills, monster) {
    let results = this.getParsed(cliString)
    // console.log(results)

    if (this.quit === true) {
      return false
    }

    if (typeof results === 'undefined') {
      this.parseError('Failed to parse due to error in submission string')
      return false
    } else {}

    if (results.length > 1) {
      console.log(results.length)
      this.parseError('Failed to parse due to ambiguity in submission string. Report string to https://github.com/Laxaria/Lask')
      return false
    } else {}

    let data = results[0]
    let game = (function() {
      if (data['game'] === null) {
        return 'mhgu'
      } else {
        return data['game']
      }
    })()
    let wep = data['weapon']
    let parsedData = data['data']
    // console.log(parsedData)

    parsedData.forEach( (i) => {
      let operand = i[1].operand
      let value = i[1].value
      let flag = i[0]
      switch (flag) {
        case 'raw':
          switch (operand) {
            case null:
              weapon.raw = parseInt(value)
              break
            case '+':
              skills.addRaw += parseInt(value)
              break
            case '-':
              skills.addRaw -= parseInt(value)
              break
            case 'x':
              skills.rawMult *= parseFloat(value)
            default:
              break
            }
            break
          case 'aff':
            switch (operand) {
              case null:
              weapon.affinity = parseInt(value)
              break
            case '+':
              skills.addAff += parseInt(value)
              break
            case '-':
              skills.addAff -= parseInt(value)
              break
            default:
              break
            }
            break
          case 'we':
            skills.WE = true
            break
          case 'cb': 
            skills.CB = true
            break
          case 'hz':
            if (value <= 1) {
              value *= 100
            }
            monster.rawHitzone = value
            break
          case 'ce':
            if (game === 'mhgu' && (1 <= value <= 3)) {
              skills.addAff += value * 10
            }
            break
          case 'aus':
            if (game === 'mhgu') {
              skills.addRaw += 10
            }
            break
          case 'aum':
            if (game === 'mhgu') {
              skills.addRaw += 15
            }
            break
          case 'aul':
            if (game === 'mhgu') {
              skills.addRaw += 20
            }
            break
          case 'mv':
            if (value <= 1) {
              value *= 100
            }
            weapon.rawMotionValue = value
            break
          case null:
            this.parseError("There was an error with parsing, likely because of a unmatched string")
            break
          default:
            // console.log(i)
            break
      }
    })
  }

  getParsed(cliString) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    let errOffset
    try {
      parser.feed(cliString)
    } catch(err) {
      errOffset = err.token.offset
    }
    if (errOffset === 'undefined') {
      this.parseError('Failed to parse due to error in submission string')
      return
    } else if (errOffset >= 0) {
        if (errOffset === 0) {
          errOffset = 3
          this.parseError(`Error somewhere around \`${cliString.slice(errOffset-3, errOffset+3)}\``)
          return false
        }
      } else {
      return parser.results
    }
  }



  // regExpTest (regexp, string) {
  //   let re = new RegExp(regexp)
  //   return re.test(string)
  // }

  parseError(errmsg) {
    this.quit = true
    this.errmsg = errmsg
    return
  }

  // parseRawOrAff(string, weapon, skills) {
  //   let data = string.split(' ')
  //   let flag = data[1]
  //   let val = this._parseRawOrAffValue(data[0], flag)
  //   if (val === false) {
  //     return
  //   }
  //   if (val[0] === 'set' && (weapon.raw === 0 || weapon.affinity === 0)) {
  //     switch (flag) {
  //       case 'raw': 
  //         weapon.raw = val[1]
  //         break
  //       case 'aff':
  //         weapon.affinity = val[1]
  //     }
  //   } else if (val[0] === 'add') {
  //     switch (flag) {
  //       case 'raw':
  //         skills.addRaw += val[1]
  //         break
  //       case 'aff':
  //         skills.addAff += val[1]
  //         break
  //     }
  //   } else if (val[0] === 'rawMult') {
  //       skills.rawMult = skills.rawMult * val[1]
  //       return
  //   } else {
  //       this.parseError('Failed to parse')
  //       return
  //   }
  // }

  // _parseRawOrAffValue(numb, flag) {
  //   if (this.regExpTest(/\d/, numb)) {
  //   } else {
  //     this.parseError(`Error encounted on ${numb} ${flag}`)
  //     return false
  //   }
  //   if (flag === 'aff' && numb.includes('x')) {
  //     this.parseError('Unable to parse multiplier on affinity')
  //     return false
  //   }
  //   // Check for additional or subtraction
  //   if (numb.includes('+') || numb.includes('-')) {
  //     let valAdd = numb.match(/([\+\-])(\d{1,3})/)
  //     switch (valAdd[1]) {
  //       case '+':
  //         return ['add', parseInt(valAdd[2])]
  //       case '-':
  //         return ['add', 0 - parseInt(valAdd[2])]
  //     }
  //   // Check for raw multiplier
  //   } else if (numb.includes('x')) {
  //     let rawMult = numb.match(/x?(\d{1}\.\d{1,2})x?/)
  //       if (rawMult === null) {
  //         this.parseError('Unable to parse raw multiplier')
  //         return false
  //       } else if (rawMult !== null) {
  //           return ['rawMult', parseFloat(rawMult[1])]
  //      }
  //   // Check for setting base raw/affinity value
  //    } else {
  //       let val = numb.match(/\d{1,3}/)
  //       if (val !== null) {
  //         return ['set', parseInt(val[0])]
  //       } else {
  //         this.parseError(`Failed to parse value of ${flag}`)
  //         return false
  //       }
  //    }
  // }

  // auxParse(string) {
  //   let atkSkill = string.match(/(au([sml]))\b/)
  //   if (atkSkill === null) {
  //     this.parseError('Unable to parse AuX skill. Acceptable values are AuS/AuM/AuL.')
  //     return
  //   }
  //   else if (atkSkill !== null) {
  //     switch (atkSkill[2]) {
  //       case 's':
  //         return 10
  //       case 'm':
  //         return 15
  //       case 'l':
  //         return 20
  //       default:
  //         this.parseError('Unable to parse AuX skill. Acceptable values are AuS/AuM/AuL.')
  //         break
  //     }
  //   }
  // }

  // affSkillParse(string) {
  //   let availRanks = [1, 2, 3]
  //   let affSkill = string.match(/ce\+?(\d)\b/)
  //   if (affSkill === null) {
  //     this.parseError('Unable to parse CE skill')
  //     return
  //   } else {
  //     let affGainRank = parseInt(affSkill[1])
  //     if (availRanks.includes(affGainRank)) {
  //       return affGainRank * 10
  //     } else {
  //       this.parseError('CE Rank greater than 3')
  //       return
  //     }
  //   }
  // }

  // monHZParse(string) {
  //   let hitzone = string.match(/\d?\.?\d{1,3}\b/)
  //   if (hitzone === null) {
  //     this.parseError('Unable to parse monster raw hitzone')
  //   }
  //   hitzone = parseFloat(hitzone)
  //   // console.log(hitzone)
  //   if (hitzone < 2.0) {
  //     return parseInt(hitzone * 100)
  //   } else if (hitzone >= 2 && hitzone <= 200) {
  //     return parseInt(hitzone)
  //   } else {
  //     this.parseError('Unable to parse monster raw hitzone')
  //   }
  // }

  // parser(cliString, weapon, skills, monster) {
  //   let _data = cliString.split(',')
  //   if (_data.length > this.maxArray) {
  //     this.parseError('Data longer than tolerated max length')
  //     return
  //   }
  //   for (let i = 0; i < _data.length; i++) {
  //     if (this.quit !== false) { break }
      
  //     let _value = _data[i].trim().toLowerCase()

  //     if (_value === '') { continue }
      
  //     if (_value.includes('raw') || _value.includes('aff')) {
  //       this.parseRawOrAff(_value, weapon, skills)
  //       continue
  //     } 
      
  //     else if (this.regExpTest(/we/, _value)) {
  //       skills.WE = true
  //     } 
      
  //     else if (this.regExpTest(/cb/, _value)) {
  //       skills.CB = true
  //     } 
      
  //     else if (_value.includes('au')) {
  //       skills.addRaw = skills.addRaw + this.auxParse(_value)
  //     }

  //     else if (_value.includes('ce')) {
  //       skills.addAff = skills.addAff + this.affSkillParse(_value)
  //     }

  //     else if (_value.includes('ehz') && monster.elmHitzone === 100) {
  //       monster.elmHitzone = this.monHZParse(_value)
  //     }

  //     else if (_value.includes('hz') && monster.rawHitzone === 100) {
  //       monster.rawHitzone = this.monHZParse(_value)
  //     }

  //     else {
  //       this.parseError(`A poorly formatted string was detected. Error in \{${_value}\}. Parsing quit`)
  //     }
  //   }
  // }
}

module.exports = CLIParser