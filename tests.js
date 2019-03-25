const DamageCalculator = require("./DamageCalculator.js")

let TESTS = {
  "1" : {
    "string": "320 raw, 40 aff, 15 hz, we",
    "value": 52.8000 
  },
  "2" : {
    "string": "100 raw, 0 aff, 15 hz, we, cb, AUL, 1.5x raw",
    "value": 27
  },
  "3" : {
    "string": "320 raw, 40 aff, 0.45 hz, we, cb, +22 raw, ce3",
    "value": 215.460 
  },
  "4" : {
    "string": "nad, good, haha",
    "value": "fail"
  },
  "5" : {
    "string": "320 raw, 40 aff, 60 hz, 1.5x raw, we, cb",
    "value": 391.680
  },
}

Object.entries(TESTS).forEach(([test, data]) => {
  let dmgCalc = new DamageCalculator(data["string"])
  let output = dmgCalc.effectiveRawCalc()
  if ( dmgCalc.parse.errmsg.length > 1 && !(data["value"] === "fail") ) {
    console.log(`Test ${test} failed`)
    // console.log(output.parse.errmsg)
  }
  else if (Math.abs(output - data["value"]) > 0.1) {
    console.log(output)
    console.log(dmgCalc.parse.errmsg)
    console.log(`Test ${test} failed`)
  } else {
    console.log("Success")
  }
});
