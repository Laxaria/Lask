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

  parseError(errmsg) {
    this.quit = true
    this.errmsg = errmsg
    return
  }
}

module.exports = CLIParser