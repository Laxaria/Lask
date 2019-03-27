@{%
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

const lexer = moo.compile({
	ws: /[ \t]+/,	
  operand: /[\+\-x]/,
  game: ['mhgu', 'mhworld'],
  wep: ['lbg', 'hbg', 'bow', 'sns', 'gs', 'ls', 'db', 'ig', 'gl', 'lance', 'hammer', 'hh'],
  key: ['raw', 'aff', 'hz', 'mv', 'we', 'cb', 'au', 'ch', 'ce'],
  mhguAttackSkills: ['l', 'm', 's'],
	decimal: /\d{1,3}\.\d{1,3}/, 
  number: /[0-9]+/,
  punctuaton: /[.,\/#!$%\^&\*;:{}=\-_`~()]+/,
})
%}

@lexer lexer

MAIN                    -> PREDATA ":" %ws DATA								{% function (a) {return {"game": a[0].game, "weapon": a[0].weapon, "data": a[3]}} %}
												 | DATA																{% function (a) {return {"game": null, "weapon": null, "data": a[0]}} %}

PREDATA									-> %game %ws WEP											{% (a) => {return {'game': a[0].value, 'weapon': a[2].value}} %}
												 | WEP																{% (a) => {return {'game': null, 'weapon': a[0].value}} %}

WEP											-> %wep															{% id %}
												 | "cb"																{% id %}

DATA                   -> SEGMENT
	                       | DATA "," " " SEGMENT 	  					{% appendItem(0,3) %}

SEGMENT                 -> VALUE " " WORD 	  	    					{% (a) => { return [a[2].value, a[0]] } %}
		                     | WORD " " VALUE    									{% (a) => { return [a[0].value, a[2]] } %}
		                     | WORD     													{% (a) => { return [a[0].value, {'value': null, 'operand': null} ] } %}
		                     | WORD VALUE													{% (a) => { return [a[0].value, a[1]] } %}

WORD										-> %key														{% id %}
												#  | DISAMBIG												{% id %}
												#  | STATIC_SKILL									{% (a) => {return a[0].value} %}
												#  | VARIABLE_SKILL								{% (a) => {return a[0].value} %}
												#  | %parse_error									{% (a) => {if (a[0].type === 'parse_error') {return a[0].value}} %}
	
VALUE 									-> NUMBER 														{% constructMetaObj(0) %}
	   										 | %operand NUMBER 										{% constructMetaObj(1, 0) %}
	   									   | NUMBER %operand										{% constructMetaObj(0, 1) %}
												 | [sml]															{% constructMetaObj(0) %}
	
NUMBER 									-> %number														{% id %}
												 | %decimal 													{% id %}

# DISAMBIG								-> "cb"														{% id %}

# KEYWORD 							 -> "raw"													{% id %}
# 		  									| "aff" 												{% id %}
# 		  									| "hz" 													{% id %}
# 		 										| "mv" 													{% id %}
		  
# STATIC_SKILL 					 -> "we" 													{% id %}
# 		     								| "cb" 													{% id %}
				
# VARIABLE_SKILL 				-> "ce" 													{% id %}
# 											 | "ch" 													{% id %}
# 									     | "au"														{% id %} 