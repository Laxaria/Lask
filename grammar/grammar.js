// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

const sharps = ['yellow', 'red', 'orange', 'blue', 'white', 'purple', 'green']
const weps = ['lbg', 'hbg', 'bow', 'sns', 'gs', 'ls', 'db', 'ig', 'gl', 'lance', 'hammer', 'hh']
const games = ['mhgu', 'mhworld']
const keys = ['raw', 'aff', 'hz', 'ehz', 'mv', 'emv', 'we', 'cb', 'au', 'ch', 'ce', 'sharp', 'gdm', 'tsu', 'rup', 'pup', 'sprdup', 'pp', 'critdraw', 'hits', 'nup']
const mhguAtkSkills = ['aus', 'aum', 'aul']
const elements = ['fire', 'ice', 'water', 'thunder', 'dragon', 'thun', 'dra', 'ele', 'eatk', 'elemental', 'critele', 'elecrit']
const totals = [].concat(mhguAtkSkills, weps, games, keys, sharps, elements)

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
          element: elements,
         }},
  decimal: /\d{0,3}\.\d{1,3}/, 
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
