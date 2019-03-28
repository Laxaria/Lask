const nearley = require('nearley')
const grammar = require('../grammar/grammar')
const mhguSieve = require ('../utils/mhguUtils')

class ParserOutputStruct { 
  constructor(game, keyword, value, operand) {
    this.game = game
    this.keyword = keyword
    this.value = value
    this.operand = operand
  }
}

class CLIParser {
  constructor() {
    this.maxLength = 300
    this.quit = false
    this.errmsg = '0'
  };
  
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

      let structData = new ParserOutputStruct(game, keyword, value, operand)

      switch (keyword) {
        case 'raw':
        case 'aff':
        case 'aus':
        case 'aum':
        case 'aul':
        case 'we':
        case 'cb': 
        case 'hz':
        case 'ce':
        case 'mv':
        case 'gdm':
        case 'ch':
        case 'sharp':
          if ( ['ce', 'ch'].includes(structData.keyword)) {
            structData.operand = null
          } else if ( ['sharp'].includes(structData.keyword)) {
            structData.operand = null
          }
          let check = mhguSieve(structData, weapon, skills, monster)
          if (check !== true) {
            this.parseError(check)
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