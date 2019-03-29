const nearley = require('nearley')
const grammar = require('../grammar/grammar')

class ParserOutput { 
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
    this.Sieve 
  };
  
  parse(cliString, weapon, skills, monster) {
    let results = this.getParsed(cliString)

    if (this.quit === true) { return }

    let data = results[0]
    let game = (function() {
      if (data['game'] === null) {
        return 'mhgu'
      } else {
        return data['game']
      }
    })()
    if (game === 'mhgu') {
      const MHGUSieve = require ('../utils/mhguUtils')
      this.Sieve = new MHGUSieve ()
    }
    weapon.name = data['weapon']
    this.Sieve.wepSieve(weapon)

    let parsedData = data['data']

    for (let i = 0; i < parsedData.length; i++) {
      if (this.quit === true) { break }

      let row = parsedData[i]
      let operand = row[1].operand
      let value = row[1].value
      let keyword = row[0]
      let structData = new ParserOutput(game, keyword, value, operand)

      switch (keyword) {
        case null:
          this.parseError('There was a parser error, likely due to a string not triggering a keyword.')
          break
        case 'critele':
          structData.keyword = 'elecrit'
        case 'au':
        case 'ce':
        case 'ch':
        case 'sharp':
        case 'eatk':
          structData.operand = null
        default:
          let check = this.Sieve.sieve(structData, weapon, skills, monster)
          if (check !== true) {
            this.parseError(check)
          }
          break
        }
    }
  }

  getParsed(cliString) {
    if (cliString.length >= this.maxLength) {
      this.parseError(`Input string is too long. Max is ${this.maxLength} characters`)
    }
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    try {
      parser.feed(cliString)
      if (parser.results.length === 1) {
        return parser.results
      } else {
        this.parseError('Failed to parse due to ambiguity in submission string. Report string to https://github.com/Laxaria/Lask')
        return null
      }
    } catch (err) {
      this.parseError('Failed to parse')
      return null
    }
  }

  parseError(errmsg) {
    this.quit = true
    this.errmsg = errmsg
    return null
  }
}

module.exports = CLIParser