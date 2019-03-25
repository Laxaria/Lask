const damageCalculator = require("./damageCalculator.js")

let TESTS = {
  "1" : {
    "string": "320 raw, 40 aff, 15 hz, we",
    "value": 52.8000 
  }
}

Object.entries(TESTS).forEach(([test, data]) => {
  let dmgCalc = new damageCalculator(data["string"])
  let output = dmgCalc.effectiveRawCalc()
  console.log(`Test ${test} \n Test String ${data["string"]} Expected Value ${data["value"]} \n App Value ${output} \n ---`)
});
