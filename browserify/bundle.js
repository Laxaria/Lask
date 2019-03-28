(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Weapon = require("./models/weapon")
const CLIParser = require("./models/parser")
const Skills = require("./models/skills")
const Monster = require("./models/monster")

class Lask {
  constructor (cliString) {
    this.cliString = cliString.toLowerCase()
    this.weapon = new Weapon()
    this.skills = new Skills()
    this.parse = new CLIParser()
    this.monster = new Monster()
    this.parse.parser(this.cliString, this.weapon, this.skills, this.monster)
  }

  weaponStats() {
    let output = {
      "raw": this.weapon.raw + this.skills.addRaw,
      "affinity": this.weapon.affinity,
      "crit boost": this.skills.CB,
      "raw mults": this.skills.rawMult,
      "add affinity": this.skills.addAff,
      "monster raw hitzone": this.monster.rawHitzone,
      "monster element hitzone": this.monster.elmHitzone,
    }
    return output
  }

  _effRawCalc(debug = true) {
    let raw = this.weapon.raw
    let addRaw = this.skills.addRaw
    let wepAff = this.weapon.affinity
    let wepMV = this.weapon.rawMotionValue
    let wepMult = this.weapon.weaponMult

    let addAff = this.skills.addAff
    let affMod = this.skills.critMod()
    let rawMult = this.skills.getRawMult()
    let stringRawMult = this.skills.rawMult.join(' * ')

    let monsterRawHZ = this.monster.rawHitzone

    let totalAff = () => {
      let _totalAff = addAff + wepAff
      if (monsterRawHZ >= 45 && this.skills.WE === true) {
        _totalAff += 50
      }
      if (_totalAff >= 100) {
        _totalAff = 100
      }
      return _totalAff
    }

    let damageCalcString = `${wepMult} * (${raw} + ${addRaw}) * (1 + ${totalAff()/100} * ${affMod}) * ${stringRawMult} * ${monsterRawHZ/100} * ${wepMV/100} * ${this.monster.globalDefMod}`
    if (debug === true) {
      console.log(damageCalcString)
    }
    return (wepMult * (raw + addRaw) * (1 + totalAff()/100 * affMod) * rawMult * monsterRawHZ/100 * wepMV/100).toPrecision(6)
  }

  effectiveRawCalc(dmgOnly = false) {
    if (this.parse.quit === true) {
      return this.parse.errmsg
    } 
    if (dmgOnly === true) {
      if (this.monster.rawHitzone === 100) {
        return this._effRawCalc(false)
      } else if (this.monster.rawHitzone !== 100) {
        return Math.floor(Math.floor(this._effRawCalc(true)) * this.monster.globalDefMod)
      }
    } else if (dmgOnly === false) {
        if (this.monster.rawHitzone === 100) {
          return `Effective Raw: ${this._effRawCalc()}`
        } else if (this.monster.rawHitzone !== 100) {
          return `Effective Damage: ${Math.floor(Math.floor(this._effRawCalc()) * this.monster.globalDefMod)}`
        }
    }
  }
}

module.exports = Lask

},{"./models/monster":3,"./models/parser":4,"./models/skills":5,"./models/weapon":6}],2:[function(require,module,exports){
// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

const sharps = ['yellow', 'red', 'orange', 'blue', 'white', 'purple', 'green']
const weps = ['lbg', 'hbg', 'bow', 'sns', 'gs', 'ls', 'db', 'ig', 'gl', 'lance', 'hammer', 'hh']
const games = ['mhgu', 'mhworld']
const keys = ['raw', 'aff', 'hz', 'mv', 'we', 'cb', 'au', 'ch', 'ce', 'sharp', 'gdm', 'tsu', 'rup', 'pup', 'sprdup']
const mhguAtkSkills = ['aus', 'aum', 'aul']
const totals = [].concat(mhguAtkSkills, weps, games, keys, sharps)

const lexer = moo.compile({
  myError: {match: /[\$?`]/, error: true},
  ws: /[ \t]+/,  
  operand: /[\+\-x]/,
  word: {match: /[a-z]+/,
         keyword: {
          game: games,
          wep: weps,
          mhguAttackSkills: mhguAtkSkills,
          key: keys,
          sharp: sharps,
         }},
  decimal: /\d{1,3}\.\d{1,3}/, 
  number: /[0-9]+/,
  punctuaton: /[.,\/#!$%\^&\*;:{}=\-_`~()]+/,
})

let appendItems = (d, a, b) => {
  return d[a].concat([d[b]])
}

let constructMetaObj = (a, b=null) => { 
  return (d) => { 
    if (b === null) {
      return {'value': d[a].value, 'operand': null}
    } else {
    return {'value': d[a].value, 'operand': d[b].value}}
  }
}
  
let constructPartData = (a = null, b) => {
  return (d) => {
    if (a === null) {
      return {'game': null, 'weapon': d[b].value}
    } else {
      return {'game': d[a].value, 'weapon': d[b].value}
    }
  }
}

let validityCheck = (a) => {
  return (d) => {
    if (totals.includes(d[a].value)) {
      return d[0]
    } else {
      return {'value': null}
    }
  }
}


var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "MAIN$ebnf$1", "symbols": ["WS"], "postprocess": id},
    {"name": "MAIN$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "MAIN", "symbols": ["PREDATA", {"literal":":"}, "MAIN$ebnf$1", "DATA"], "postprocess": (d) => {return {"game": d[0].game, "weapon": d[0].weapon, "data": d[d.length-1]}}},
    {"name": "MAIN", "symbols": ["DATA"], "postprocess": (d) => {return {"game": null, "weapon": null, "data": d[0]}}},
    {"name": "PREDATA", "symbols": [(lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)], "postprocess": constructPartData(0, 2)},
    {"name": "PREDATA", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": constructPartData(null, 0)},
    {"name": "WS", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "DATA", "symbols": ["SEGMENT"]},
    {"name": "DATA$ebnf$1", "symbols": ["WS"], "postprocess": id},
    {"name": "DATA$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DATA", "symbols": ["DATA", {"literal":","}, "DATA$ebnf$1", "SEGMENT"], "postprocess": (d) => appendItems(d, 0, d.length-1)},
    {"name": "SEGMENT", "symbols": ["VALUE", "WS", "WORD"], "postprocess": (d) => { return [d[2].value, d[0]] }},
    {"name": "SEGMENT", "symbols": ["WORD", "WS", "VALUE"], "postprocess": (d) => { return [d[0].value, d[2]] }},
    {"name": "SEGMENT", "symbols": ["WORD"], "postprocess": (d) => { return [d[0].value, {'value': null, 'operand': null} ] }},
    {"name": "SEGMENT", "symbols": ["WORD", (lexer.has("ws") ? {type: "ws"} : ws), "WORD"], "postprocess": (d) => { if (d[0].text === 'sharp') {return [d[0].value, {'value': d[2].value, 'operand': null}]} else {return [d[2].value, {'value': d[0].value, 'operand': null}]}}},
    {"name": "SEGMENT", "symbols": ["WORD", "VALUE"], "postprocess": (d) => { return [d[0].value, d[1]] }},
    {"name": "WORD", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": validityCheck(0)},
    {"name": "VALUE", "symbols": ["NUMBER"], "postprocess": constructMetaObj(0)},
    {"name": "VALUE", "symbols": [(lexer.has("operand") ? {type: "operand"} : operand), "NUMBER"], "postprocess": constructMetaObj(1, 0)},
    {"name": "VALUE", "symbols": ["NUMBER", (lexer.has("operand") ? {type: "operand"} : operand)], "postprocess": constructMetaObj(0, 1)},
    {"name": "NUMBER", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": id},
    {"name": "NUMBER", "symbols": [(lexer.has("decimal") ? {type: "decimal"} : decimal)], "postprocess": id}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

},{"moo":7}],3:[function(require,module,exports){
class Monster {
  constructor() {
    this.rawHitzone = 100
    this.elmHitzone = 100
    this.globalDefMod = 1
  }
}

module.exports = Monster
},{}],4:[function(require,module,exports){
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
    weapon.name = wep

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
        case 'tsu':
        case 'pup':
        case 'nup':
        case 'sprdup':
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
},{"../grammar/grammar":2,"../utils/mhguUtils":10,"nearley":8}],5:[function(require,module,exports){
class Skills {
  constructor () {
    this.CB = false
    this.WE = false
    this.addRaw = 0
    this.addAff = 0
    this.rawMult = []
  }
  critMod() {
    if (this.CB === false) {
      return 0.25
    } else if (this.CB === true) {
      return 0.40
    } else {
      return 0.25
    }
  }
  getRawMult() {
    let multiplier = 1.0
    if (this.rawMult.length === 0) {
      return multiplier
    } else {
      this.rawMult.forEach ( (i) => {
        multiplier *= i
      })
      return multiplier
    }
  }
}

module.exports = Skills
},{}],6:[function(require,module,exports){
class Weapon {
  constructor (str) {
    this.str = str
    this._raw = 0
    this._element = 0
    this._affinity = 0
    this.rawMotionValue = 100
    this.name = ''
    this.weaponMult = 1.0
  }
  set raw(val) {
    this._raw = val
  }
  get raw() {
    return this._raw
  }
  set affinity(val) {
    this._affinity = val
    if (this._affinity >= 100) {
      this._affinity = 100
    }
  }
  get affinity() {
    return this._affinity
  }  
}

module.exports = Weapon
},{}],7:[function(require,module,exports){
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory) /* global define */
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.moo = factory()
  }
}(this, function() {
  'use strict';

  var hasOwnProperty = Object.prototype.hasOwnProperty

  // polyfill assign(), so we support IE9+
  var assign = typeof Object.assign === 'function' ? Object.assign :
    // https://tc39.github.io/ecma262/#sec-object.assign
    function(target, sources) {
      if (target == null) {
        throw new TypeError('Target cannot be null or undefined');
      }
      target = Object(target)

      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        if (source == null) continue

        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
      return target
    }

  var hasSticky = typeof new RegExp().sticky === 'boolean'

  /***************************************************************************/

  function isRegExp(o) { return o && o.constructor === RegExp }
  function isObject(o) { return o && typeof o === 'object' && o.constructor !== RegExp && !Array.isArray(o) }

  function reEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  function reGroups(s) {
    var re = new RegExp('|' + s)
    return re.exec('').length - 1
  }
  function reCapture(s) {
    return '(' + s + ')'
  }
  function reUnion(regexps) {
    var source =  regexps.map(function(s) {
      return "(?:" + s + ")"
    }).join('|')
    return "(?:" + source + ")"
  }

  function regexpOrLiteral(obj) {
    if (typeof obj === 'string') {
      return '(?:' + reEscape(obj) + ')'

    } else if (isRegExp(obj)) {
      // TODO: consider /u support
      if (obj.ignoreCase) { throw new Error('RegExp /i flag not allowed') }
      if (obj.global) { throw new Error('RegExp /g flag is implied') }
      if (obj.sticky) { throw new Error('RegExp /y flag is implied') }
      if (obj.multiline) { throw new Error('RegExp /m flag is implied') }
      return obj.source

    } else {
      throw new Error('not a pattern: ' + obj)
    }
  }

  function objectToRules(object) {
    var keys = Object.getOwnPropertyNames(object)
    var result = []
    for (var i=0; i<keys.length; i++) {
      var key = keys[i]
      var thing = object[key]
      var rules = Array.isArray(thing) ? thing : [thing]
      var match = []
      rules.forEach(function(rule) {
        if (isObject(rule)) {
          if (match.length) result.push(ruleOptions(key, match))
          result.push(ruleOptions(key, rule))
          match = []
        } else {
          match.push(rule)
        }
      })
      if (match.length) result.push(ruleOptions(key, match))
    }
    return result
  }

  function arrayToRules(array) {
    var result = []
    for (var i=0; i<array.length; i++) {
      var obj = array[i]
      if (!obj.name) {
        throw new Error('Rule has no name: ' + JSON.stringify(obj))
      }
      result.push(ruleOptions(obj.name, obj))
    }
    return result
  }

  function ruleOptions(name, obj) {
    if (typeof obj !== 'object' || Array.isArray(obj) || isRegExp(obj)) {
      obj = { match: obj }
    }

    // nb. error implies lineBreaks
    var options = assign({
      tokenType: name,
      lineBreaks: !!obj.error,
      pop: false,
      next: null,
      push: null,
      error: false,
      value: null,
      getType: null,
    }, obj)

    // convert to array
    var match = options.match
    options.match = Array.isArray(match) ? match : match ? [match] : []
    options.match.sort(function(a, b) {
      return isRegExp(a) && isRegExp(b) ? 0
           : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
    })
    if (options.keywords) {
      options.getType = keywordTransform(options.keywords)
    }
    return options
  }

  function compileRules(rules, hasStates) {
    rules = Array.isArray(rules) ? arrayToRules(rules) : objectToRules(rules)

    var errorRule = null
    var groups = []
    var parts = []
    for (var i=0; i<rules.length; i++) {
      var options = rules[i]

      if (options.error) {
        if (errorRule) {
          throw new Error("Multiple error rules not allowed: (for token '" + options.tokenType + "')")
        }
        errorRule = options
      }

      // skip rules with no match
      if (options.match.length === 0) {
        continue
      }
      groups.push(options)

      // convert to RegExp
      var pat = reUnion(options.match.map(regexpOrLiteral))

      // validate
      var regexp = new RegExp(pat)
      if (regexp.test("")) {
        throw new Error("RegExp matches empty string: " + regexp)
      }
      var groupCount = reGroups(pat)
      if (groupCount > 0) {
        throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
      }
      if (!hasStates && (options.pop || options.push || options.next)) {
        throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.tokenType + "')")
      }

      // try and detect rules matching newlines
      if (!options.lineBreaks && regexp.test('\n')) {
        throw new Error('Rule should declare lineBreaks: ' + regexp)
      }

      // store regex
      parts.push(reCapture(pat))
    }

    var suffix = hasSticky ? '' : '|(?:)'
    var flags = hasSticky ? 'ym' : 'gm'
    var combined = new RegExp(reUnion(parts) + suffix, flags)

    return {regexp: combined, groups: groups, error: errorRule}
  }

  function compile(rules) {
    var result = compileRules(rules)
    return new Lexer({start: result}, 'start')
  }

  function compileStates(states, start) {
    var keys = Object.getOwnPropertyNames(states)
    if (!start) start = keys[0]

    var map = Object.create(null)
    for (var i=0; i<keys.length; i++) {
      var key = keys[i]
      map[key] = compileRules(states[key], true)
    }

    for (var i=0; i<keys.length; i++) {
      var groups = map[keys[i]].groups
      for (var j=0; j<groups.length; j++) {
        var g = groups[j]
        var state = g && (g.push || g.next)
        if (state && !map[state]) {
          throw new Error("Missing state '" + state + "' (in token '" + g.tokenType + "' of state '" + keys[i] + "')")
        }
        if (g && g.pop && +g.pop !== 1) {
          throw new Error("pop must be 1 (in token '" + g.tokenType + "' of state '" + keys[i] + "')")
        }
      }
    }

    return new Lexer(map, start)
  }

  function keywordTransform(map) {
    var reverseMap = Object.create(null)
    var byLength = Object.create(null)
    var types = Object.getOwnPropertyNames(map)
    for (var i=0; i<types.length; i++) {
      var tokenType = types[i]
      var item = map[tokenType]
      var keywordList = Array.isArray(item) ? item : [item]
      keywordList.forEach(function(keyword) {
        (byLength[keyword.length] = byLength[keyword.length] || []).push(keyword)
        if (typeof keyword !== 'string') {
          throw new Error("keyword must be string (in keyword '" + tokenType + "')")
        }
        reverseMap[keyword] = tokenType
      })
    }

    // fast string lookup
    // https://jsperf.com/string-lookups
    function str(x) { return JSON.stringify(x) }
    var source = ''
    source += '(function(value) {\n'
    source += 'switch (value.length) {\n'
    for (var length in byLength) {
      var keywords = byLength[length]
      source += 'case ' + length + ':\n'
      source += 'switch (value) {\n'
      keywords.forEach(function(keyword) {
        var tokenType = reverseMap[keyword]
        source += 'case ' + str(keyword) + ': return ' + str(tokenType) + '\n'
      })
      source += '}\n'
    }
    source += '}\n'
    source += '})'
    return eval(source) // getType
  }

  /***************************************************************************/

  var Lexer = function(states, state) {
    this.startState = state
    this.states = states
    this.buffer = ''
    this.stack = []
    this.reset()
  }

  Lexer.prototype.reset = function(data, info) {
    this.buffer = data || ''
    this.index = 0
    this.line = info ? info.line : 1
    this.col = info ? info.col : 1
    this.setState(info ? info.state : this.startState)
    return this
  }

  Lexer.prototype.save = function() {
    return {
      line: this.line,
      col: this.col,
      state: this.state,
    }
  }

  Lexer.prototype.setState = function(state) {
    if (!state || this.state === state) return
    this.state = state
    var info = this.states[state]
    this.groups = info.groups
    this.error = info.error || {lineBreaks: true, shouldThrow: true}
    this.re = info.regexp
  }

  Lexer.prototype.popState = function() {
    this.setState(this.stack.pop())
  }

  Lexer.prototype.pushState = function(state) {
    this.stack.push(this.state)
    this.setState(state)
  }

  Lexer.prototype._eat = hasSticky ? function(re) { // assume re is /y
    return re.exec(this.buffer)
  } : function(re) { // assume re is /g
    var match = re.exec(this.buffer)
    // will always match, since we used the |(?:) trick
    if (match[0].length === 0) {
      return null
    }
    return match
  }

  Lexer.prototype._getGroup = function(match) {
    if (match === null) {
      return -1
    }

    var groupCount = this.groups.length
    for (var i = 0; i < groupCount; i++) {
      if (match[i + 1] !== undefined) {
        return i
      }
    }
    throw new Error('oops')
  }

  function tokenToString() {
    return this.value
  }

  Lexer.prototype.next = function() {
    var re = this.re
    var buffer = this.buffer

    var index = re.lastIndex = this.index
    if (index === buffer.length) {
      return // EOF
    }

    var match = this._eat(re)
    var i = this._getGroup(match)

    var group, text
    if (i === -1) {
      group = this.error

      // consume rest of buffer
      text = buffer.slice(index)

    } else {
      text = match[0]
      group = this.groups[i]
    }

    // count line breaks
    var lineBreaks = 0
    if (group.lineBreaks) {
      var matchNL = /\n/g
      var nl = 1
      if (text === '\n') {
        lineBreaks = 1
      } else {
        while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex }
      }
    }

    var token = {
      type: (group.getType && group.getType(text)) || group.tokenType,
      value: group.value ? group.value(text) : text,
      text: text,
      toString: tokenToString,
      offset: index,
      lineBreaks: lineBreaks,
      line: this.line,
      col: this.col,
    }
    // nb. adding more props to token object will make V8 sad!

    var size = text.length
    this.index += size
    this.line += lineBreaks
    if (lineBreaks !== 0) {
      this.col = size - nl + 1
    } else {
      this.col += size
    }
    // throw, if no rule with {error: true}
    if (group.shouldThrow) {
      throw new Error(this.formatError(token, "invalid syntax"))
    }

    if (group.pop) this.popState()
    else if (group.push) this.pushState(group.push)
    else if (group.next) this.setState(group.next)
    return token
  }

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    var LexerIterator = function(lexer) {
      this.lexer = lexer
    }

    LexerIterator.prototype.next = function() {
      var token = this.lexer.next()
      return {value: token, done: !token}
    }

    LexerIterator.prototype[Symbol.iterator] = function() {
      return this
    }

    Lexer.prototype[Symbol.iterator] = function() {
      return new LexerIterator(this)
    }
  }

  Lexer.prototype.formatError = function(token, message) {
    var value = token.value
    var index = token.offset
    var eol = token.lineBreaks ? value.indexOf('\n') : value.length
    var start = Math.max(0, index - token.col + 1)
    var firstLine = this.buffer.substring(start, index + eol)
    message += " at line " + token.line + " col " + token.col + ":\n\n"
    message += "  " + firstLine + "\n"
    message += "  " + Array(token.col).join(" ") + "^"
    return message
  }

  Lexer.prototype.clone = function() {
    return new Lexer(this.states, this.state)
  }

  Lexer.prototype.has = function(tokenType) {
    for (var s in this.states) {
      var groups = this.states[s].groups
      for (var i=0; i<groups.length; i++) {
        var group = groups[i]
        if (group.tokenType === tokenType) return true
        if (group.keywords && hasOwnProperty.call(group.keywords, tokenType)) {
          return true
        }
      }
    }
    return false
  }


  return {
    compile: compile,
    states: compileStates,
    error: Object.freeze({error: true}),
  }

}))

},{}],8:[function(require,module,exports){
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        function stringifySymbolSequence (e) {
            return e.literal ? JSON.stringify(e.literal) :
                   e.type ? '%' + e.type : e.toString();
        }
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(stringifySymbolSequence).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var line = buffer.substring(this.lastLineBreak, nextLineBreak)
            var col = this.index - this.lastLineBreak;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += "  " + line + "\n"
            message += "  " + Array(col).join(" ") + "^"
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }
    }


    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (token = lexer.next()) {
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var message = this.lexer.formatError(token, "invalid syntax") + "\n";
                message += "Unexpected " + (token.type ? token.type + " token: " : "");
                message += JSON.stringify(token.value !== undefined ? token.value : token) + "\n";
                var err = new Error(message);
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));

},{}],9:[function(require,module,exports){
const Lask = require("./Lask")

if(window.attachEvent) {
  window.attachEvent('onload', onstructPage);
} else {
  if(window.onload) {
    var curronload = window.onload;
    var newonload = function(evt) {
      // curronload(evt);
      constructPage(evt);
    };
    window.onload = newonload;
  } else {
    window.onload = constructPage;
  }
};

function constructPage (evt) {
  let mainDiv = document.getElementById('main_div');
  let appDiv = document.createElement('div');
  appDiv.id = "app"
  mainDiv.appendChild(appDiv)
  constructForm();
};

function constructForm () {
  let inputArrays = ["CLI"];
  let divApp = document.getElementById("app");
  let newForm = document.createElement("form");
  let output = document.createElement("p");
  output.id = "output";
  newForm.id = "mainformapp";
  for (let curs = 0; curs < inputArrays.length; curs ++) {
    let input = document.createElement("input");
    input.type = "textarea";
    input.style.width = "500px";
    input.id = inputArrays[curs];
    formFormer(input, inputArrays[curs], newForm);
  };
  let submitInput = document.createElement("input")
  submitInput.type = "button";
  submitInput.value = "Submit";
  submitInput.onclick = submitData;
  newForm.appendChild(document.createElement("br"))
  newForm.appendChild(submitInput);
  divApp.appendChild(newForm);
  divApp.appendChild(output)
}

function formFormer (element, elementText, formElement) {
  formElement.append(elementText)
  formElement.appendChild(document.createElement("br"))
  formElement.appendChild(element)
  formElement.appendChild(document.createElement("br"))
}

function submitData () {
  let elements = document.getElementById("mainformapp").elements;
  let dataPromise = new Promise ((resolve, reject) => {
    let dmg = new Lask(elements['CLI'].value)
    resolve(dmg)
  })
  dataPromise.then((value) => {
    console.log(value.weaponStats())
    let str = `${value.effectiveRawCalc()} \n ----`
    let subDiv = document.createElement("div");
    subDiv.innerText = str;
    document.getElementById("output_div").prepend(subDiv);
  })
};




},{"./Lask":1}],10:[function(require,module,exports){
const sharpConstants = {
  'purple': 1.39,
  'white': 1.32,
  'blue': 1.20,
  'green': 1.05,
  'yellow': 1.00,
  'orange': 0.75,
  'red': 0.50
}

const rawAffStruct = {
  'raw': (load, v) => { if (load.wp.raw === 0) {load.wp.raw = v; return true} else {return 'Weapon raw assigned more than once'}},
  'aff': (load, v) => { if (load.wp.affinity === 0) {load.wp.affinity = v; return true} else {return 'Weapon affinity assigned more than once'}},
  '+raw': (load, v) => { load.sk.addRaw += v; return true},
  '-raw': (load, v) => { load.sk.addRaw -= v; return true},
  'xraw': (load, v) => { load.sk.rawMult.push(v); return true},
  '+aff': (load, v) => { load.sk.addAff += v; return true},
  '-aff': (load, v) => { load.sk.addAff += v; return true},
  'xaff': () => { return 'Multipliers to affinity are not allowed'},
  'aus': (sk) => { sk.addRaw += 10; return true},
  'aum': (sk) => { sk.addRaw += 15; return true},
  'aul': (sk) => { sk.addRaw += 20; return true},
  'we': (sk) => { sk.WE = true; return true},
  'cb': (sk) => { sk.CB = true; return true},
  'nup': (sk) => { sk.rawMult.push(1.1); return true},
  'pup': (sk) => { sk.rawMult.push(1.1); return true},
  'tsu': (sk) => { sk.rawMult.push(1.2); return true},
  'sprdup': (sk) => { sk.rawMult.push(1.3); return true},
  'hz': (load, v) => { if (0 <= v && v <= 2) { load.m.rawHitzone = v * 100 } else {load.m.rawHitzone = v}; return true},
  'ce': (load, v) => { if (1 <= v && v <= 3) { load.sk.addAff += v * 10; return true} else {return 'MHGU Crit Eye ranges only from 1 - 3'}},
  'mv': (load, v) => { if (v <= 1.5) {load.wp.rawMotionValue = v * 100} else {load.wp.rawMotionValue = v}; return true},
  'gdm': (load, v) => { if (v >= 1.5) {return 'Global Def Mod value should be less than 1~'} else {load.m.globalDefMod = v; return true}},
  'ch': (load, v) => { 
    switch (v) {
      case 1:
        load.sk.addAff += 10
        load.sk.addRaw += 10
        return true
      case 2:
        load.sk.addAff += 15
        load.sk.addRaw += 20 
        return true
      default:
      return 'Challenge can only be at level 1 or level 2'
    }
  },
  'sharp': (load, v) => { load.sk.rawMult.push(sharpConstants[v]); return true},
  'lbg': (load) => { if (load.wp.weaponMult === 1.0) {load.wp.weaponMult = 1.3; return true} else {return 'Failed to parse weapon multiplier'}},
  'hbg': (load) => { if (load.wp.weaponMult === 1.0) {load.wp.weaponMult = 1.5; return true} else {return 'Failed to parse weapon multiplier'}},
  'statics': ['aus', 'aum', 'aul', 'we', 'cb', 'nup', 'sprdup', 'pup', 'tsu', 'sprdup'],
  'weapons': ['lbg', 'hbg']
}

function mhguSieve(payload, weapon, skills, monster) {

  let load = {
    wp: weapon,
    sk: skills,
    m: monster,
  }

  if (rawAffStruct['statics'].includes(payload.keyword)) {
    return rawAffStruct[payload.keyword](load.sk)
  }

  if (rawAffStruct['weapons'].includes(weapon.name)) {
    return rawAffStruct[weapon.name](load)
  }

  if (['sharp'].includes(payload.keyword)) {
    return rawAffStruct[payload.keyword](load, payload.value)
  }

  if (!Number.isInteger(payload.value) && payload.value !== null) {
    payload.value = parseFloat(payload.value)
  } else if (Number.isInteger(payload.value)) {
    payload.value = parseInt(payload.value)
  } else {
    return `Unable to parse value associated with ${payload.keyword}`
  }

  if (payload.operand === null) {payload.operand = ''}

  return rawAffStruct[payload.operand+payload.keyword](load, payload.value)

}

module.exports = mhguSieve
},{}]},{},[9]);
