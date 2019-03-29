@{%
const moo = require('moo')

const sharps = ['yellow', 'red', 'orange', 'blue', 'white', 'purple', 'green']
const weps = ['lbg', 'hbg', 'bow', 'sns', 'gs', 'ls', 'db', 'ig', 'gl', 'lance', 'hammer', 'hh']
const games = ['mhgu', 'mhworld']
const keys = ['raw', 'aff', 'hz', 'ehz', 'mv', 'emv', 'we', 'cb', 'au', 'ch', 'ce', 'sharp', 'gdm', 'tsu', 'rup', 'pup', 'sprdup', 'pp', 'critdraw']
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


%}

@lexer lexer

MAIN         -> PREDATA ":" WS:? DATA        {% (d) => {return {"game": d[0].game, "weapon": d[0].weapon, "data": d[d.length-1]}} %}
              | DATA                         {% (d) => {return {"game": null, "weapon": null, "data": d[0]}} %}

PREDATA      -> %word %ws %word              {% constructPartData(0, 2) %}
              | %word                        {% constructPartData(null, 0) %}

WS           -> %ws                          {% id %}

DATA         -> SEGMENT
              | DATA "," WS:? SEGMENT        {% (d) => appendItems(d, 0, d.length-1) %}

SEGMENT      -> VALUE WS WORD                {% (d) => { return [d[2].value, d[0]] } %}
              | WORD WS VALUE                {% (d) => { return [d[0].value, d[2]] } %}
              | WORD                         {% (d) => { return [d[0].value, {'value': null, 'operand': null} ] } %}
              | WORD %ws WORD                {% (d) => { if (d[0].text === 'sharp') {return [d[0].value, {'value': d[2].value, 'operand': null}]} else {return [d[2].value, {'value': d[0].value, 'operand': null}]}} %}
              | WORD VALUE                   {% (d) => { return [d[0].value, d[1]] } %}

WORD         -> %word                        {% validityCheck(0) %}

VALUE        -> NUMBER                       {% constructMetaObj(0) %}
              | %operand NUMBER              {% constructMetaObj(1, 0) %}
              | NUMBER %operand              {% constructMetaObj(0, 1) %}
  
NUMBER       -> %number                      {% id %}
              | %decimal                     {% id %}
