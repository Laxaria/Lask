const nearley = require('nearley')
const grammar = require('../grammar/grammar')

GLOBAL_DEBUG = false

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
    this.errror
    this.Sieve 
  };
  
  parse(cliString, mhSet) {
    let results = this.getParsed(cliString)

    let weapon = mhSet[0]
    let skills = mhSet[1]
    let monster = mhSet[2]

    if (this.error instanceof Error) { return }
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
      this.Sieve = new MHGUSieve()
    } else if (game === 'mhworld') {
      const MHWorldSieve = require('../utils/mhworldUtils')
      this.Sieve = new MHWorldSieve()
    }

    weapon.type = data['weapon']
    this.Sieve.wepSieve(weapon)

    let parsedData = data['data']
    let j = parsedData.length

    for (let i = 0; i < j; i++) {

      // if (this.quit === true) { break }
      if (this.error instanceof Error) { break }
      
      let row = parsedData[i]
      if (GLOBAL_DEBUG) { console.log(row) }
      let operand = row[1].operand
      let value = row[1].value
      let keyword = row[0]
      let structData = new ParserOutput(game, keyword, value, operand)

      // Clean up some keywords

      switch (keyword) {
        case 'critele':
          structData.keyword = 'elecrit'
          break
        case 'au':
          structData.keyword = 'ab'
      }
      console.log(keyword)
      
      //  Sieving data to parser
      switch (keyword) {
        case null:
          this.parseError('There was a parser error, likely due to a string not triggering a keyword.')
          break
        case 'ce':
        case 'ch':
        case 'sharp':
        case 'eatk':
        case 'nup':
        case 'hits':
        case 'ab':
        case 'heroics':
        case 'pp':
        case 'resentment':
        case 'nshots':
        case 'pshots':
        case 'sprdshots':
        case 'neb':
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
      } else if (parser.results.length === 0) {
          this.parseError('Failed to parse')
      } else {
        this.parseError('Failed to parse due to ambiguity in submission string. Report string to https://github.com/Laxaria/Lask')
        return null
      }
    } catch (err) {
      this.parseError('Failed to parse')
      return null
    }
  }

  parseError(errMsg) {
    this.error = new Error(errMsg)
    // this.quit = true
    return null
  }
}

module.exports = CLIParser