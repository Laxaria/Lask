const nearley = require('nearley')
const grammar = require('../grammar/grammar')
const MHSieve = require('../utils/MHSieve')

const GLOBAL_DEBUG = false

class ParserOutput {
  constructor (game, keyword, value, operand) {
    this.game = game
    this.keyword = keyword
    this.value = value
    this.operand = operand
  }
}

class CLIParser {
  constructor () {
    this.maxLength = 300
    this.quit = false
    this.error = null
    this.Sieve = null
    this.game = null
    this.error = null
  }

  _parseLoop (arr, weapon, skills, monster) {
    let i = 0
    let j = arr.length
    for (i; i < j; i++) {
      if (this.error instanceof Error) { break }
      let row = arr[i]
      let operand = row[1].operand
      let value = row[1].value
      let keyword = row[0]
      let structData = new ParserOutput(this.game, keyword, value, operand)
      if (GLOBAL_DEBUG) { console.log(row) }
      // Clean up some keywords
      switch (keyword) {
        case 'critele':
          structData.keyword = 'elecrit'
          break
        case 'au':
          structData.keyword = 'ab'
          break
        default:
          break
      }
      // Sieve
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
        case 'mv':
        case 'hz':
        case 'ehz':
        case 'emv':
          structData.operand = null
          /* falls through */
        default:
          let check = this.Sieve.sieve(structData, weapon, skills, monster)
          if (check !== true) {
            this.parseError(check)
          }
          break
      }
    }
  }

  parse (cliString, mhSet) {
    this.game = mhSet[0]
    let weapon = mhSet[1]
    let skills = mhSet[2]
    let monster = mhSet[3]
    let results = this.getParsed(cliString)
    let data
    let parsedData

    switch (results) {
      case null:
        return null
      default:
        data = results[0]
        parsedData = data['data']
    }

    if (this.game === 'mhgu') {
      this.Sieve = new MHSieve('mhgu')
    } else if (this.game === 'mhworld') {
      this.Sieve = new MHSieve('mhworld')
    }

    weapon.type = data['weapon']
    this.Sieve.wepSieve(weapon)

    this._parseLoop(parsedData, weapon, skills, monster)
  }

  getParsed (cliString) {
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
        return null
      } else {
        this.parseError('Failed to parse due to ambiguity in submission string. Report string to https://github.com/Laxaria/Lask')
        return null
      }
    } catch (err) {
      this.parseError(`Failed to parse. Error was somewhere around '${cliString.slice(err.token.offset - 5, err.token.offset + 5)}'`)
      return null
    }
  }

  parseError (errMsg) {
    this.error = new Error(errMsg)
  }
}

module.exports = CLIParser
