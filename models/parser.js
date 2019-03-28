const nearley = require('nearley')
const grammar = require('../grammar/grammar')

class CLIParser {
  constructor() {
    this.maxLength = 300
    this.quit = false
    this.errmsg = '0'
  };
  
  parseRawAff(game, keyword, value, operand, weapon, skills) {
    let val 
    if (value.includes('.')) {
      val = parseFloat(value)
    } else {
      val = parseInt(value)
    }
    switch (keyword) {
      case 'raw':
        switch (operand) {
          case null:
            if (weapon.raw === 0 && val) {
              weapon.raw = val
            } else if (Number.isNaN(_wepRaw)) {
              this.parseError('Weapon raw was not assigned due to error in input')
            } else {
              this.parseError('Weapon raw can only be assigned once')
            }
            break
          case '+':
            skills.addRaw += val
            break
          case '-':
            skills.addRaw =- val
            break
          case 'x':
            skills.rawMult.push(val)
            break
          default:
            this.parseError('Unable to parse some section involving raw')
            break
        }
        break
      case 'aff':
        if (!Number.isInteger(val)) { this.parseError('Affinity value must be an integer (>=0)')}
        switch (operand) {
          case null:
            if (weapon.affinity === 0) {
              weapon.affinity = val
            } else {
              this.parseError('Weapon affinity can only be assigned once')
            }
            break
          case '+':
            skills.addAff += val
            break
          case '-': 
            skills.addAff -= val
            break
          case 'x':
            this.parseError('Multiplers to affinity are not allowed')
            break
          default:
            this.parseError('Unable  to parse some section involving affinity')
            break
        }
        break
        default:
          this.parseError('An error occurred')
          break
    }
  }

  parseMHGUAU(game, keyword, value, skills) {
    switch (keyword) {
      case 'aus':
        skills.addRaw += 10
        break
      case 'aum':
        skills.addRaw += 15
        break
      case 'aul':
        skills.addRaw += 20
        break
      default:
        this.parseError('An unexpected error occurred')
        break
    }
  }

  parser(cliString, weapon, skills, monster) {
    let results = this.getParsed(cliString)

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

    for (let i = 0; i < parsedData.length; i++) {
      if (this.quit === true) { break }

      let row = parsedData[i]
      let operand = row[1].operand
      let value = row[1].value
      let keyword = row[0]

      switch (keyword) {
        case 'raw':
        case 'aff':
          this.parseRawAff(game, keyword, value, operand, weapon, skills)
          break
        case 'aus':
        case 'aum':
        case 'aul':
          this.parseMHGUAU(game, keyword, value, skills)
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
        case 'mv':
          if (value <= 1) {
            value *= 100
          }
          weapon.rawMotionValue = value
          break
        case 'gdm':
          if (0 <= value <= 1) {
            monster.globalDefMod = parseFloat(value)
          }
          break
        case null:
          this.parseError("There was an error with parsing, likely because of a unmatched string")
          break
        default:
          break
      }
    }
  }

  getParsed(cliString) {
    if (cliString.length >= this.maxLength) {
      this.parseError(`Input string is too long. Max is ${this.maxLength} characters`)
    }
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    let errOffset
    try {
      parser.feed(cliString.toLowerCase().trim())
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

  parseError(errmsg) {
    this.quit = true
    this.errmsg = errmsg
    return
  }
}

module.exports = CLIParser