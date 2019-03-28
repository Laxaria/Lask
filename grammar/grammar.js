// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } }

var constructMetaObj = (a, b=null) => { 
	return (d) => { 
		if (b === null) {
			return {'value': d[a].value, 'operand': null}
		} else {
		return {'value': d[a].value, 'operand': d[b].value}}
	}
}

const sharps = ['yellow', 'red', 'orange', 'blue', 'white', 'purple', 'green']
const weps = ['lbg', 'hbg', 'bow', 'sns', 'gs', 'ls', 'db', 'ig', 'gl', 'lance', 'hammer', 'hh']
const games = ['mhgu', 'mhworld']
const keys = ['raw', 'aff', 'hz', 'mv', 'we', 'cb', 'au', 'ch', 'ce', 'sharp', 'gdm']
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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "MAIN", "symbols": ["PREDATA", {"literal":":"}, (lexer.has("ws") ? {type: "ws"} : ws), "DATA"], "postprocess": function (a) {return {"game": a[0].game, "weapon": a[0].weapon, "data": a[3]}}},
    {"name": "MAIN", "symbols": ["DATA"], "postprocess": function (a) {return {"game": null, "weapon": null, "data": a[0]}}},
    {"name": "PREDATA", "symbols": [(lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), "WEP"], "postprocess": (a) => {return {'game': a[0].value, 'weapon': a[2].value}}},
    {"name": "PREDATA", "symbols": ["WEP"], "postprocess": (a) => {return {'game': null, 'weapon': a[0].value}}},
    {"name": "WEP", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": id},
    {"name": "DATA", "symbols": ["SEGMENT"]},
    {"name": "DATA", "symbols": ["DATA", {"literal":","}, {"literal":" "}, "SEGMENT"], "postprocess": appendItem(0,3)},
    {"name": "SEGMENT", "symbols": ["VALUE", {"literal":" "}, "WORD"], "postprocess": (a) => { return [a[2].value, a[0]] }},
    {"name": "SEGMENT", "symbols": ["WORD", {"literal":" "}, "VALUE"], "postprocess": (a) => { return [a[0].value, a[2]] }},
    {"name": "SEGMENT", "symbols": ["WORD"], "postprocess": (a) => { return [a[0].value, {'value': null, 'operand': null} ] }},
    {"name": "SEGMENT", "symbols": ["WORD", (lexer.has("ws") ? {type: "ws"} : ws), "WORD"], "postprocess": (a, d, r) => { if (a[0].text === 'sharp') {return [a[0].value, {'value': a[2].value, 'operand': null}]} else {return [a[2].value, {'value': a[0].value, 'operand': null}]}}},
    {"name": "SEGMENT", "symbols": ["WORD", "VALUE"], "postprocess": (a) => { return [a[0].value, a[1]] }},
    {"name": "WORD", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": (a) => {if (totals.includes(a[0].value)) {return a[0]} else {return {'value': null}}}},
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
