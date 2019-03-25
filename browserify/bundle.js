(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// import { Weapon } from "./models/weapon.js"
// import { CLIParser } from "./models/parser.js"
// import { Skills } from "./models/skills.js"
// import { Monster } from "./models/monster.js"

const Weapon = require("./models/weapon")
const CLIParser = require("./models/parser")
const Skills = require("./models/skills")
const Monster = require("./models/monster")

class damageCalculator {
  constructor (cliString) {
    this.cliString = cliString
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
      "monster element hitzone": this.monster.elmHitzone
    }
    return output
  }

  _effRawCalc() {
    let raw = this.weapon.raw
    let addRaw = this.skills.addRaw
    let wepAff = this.weapon.affinity

    let addAff = this.skills.addAff
    let affMod = this.skills.critMod()
    let rawMult = this.skills.rawMult

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

    let damageCalcString = `(${raw} + ${addRaw}) * (1 + ${totalAff()/100} * ${affMod}) * ${rawMult} * ${monsterRawHZ/100}`
    console.log(damageCalcString)
    return ((raw + addRaw) * (1 + totalAff()/100 * affMod) * rawMult * monsterRawHZ/100).toPrecision(6)
  }

  effectiveRawCalc() {
    if (this.parse.quit === true) {
      return this.parse.errmsg
    } else {
      return this._effRawCalc()
    }
  }
}

module.exports = damageCalculator
},{"./models/monster":2,"./models/parser":3,"./models/skills":4,"./models/weapon":5}],2:[function(require,module,exports){
class Monster {
  constructor() {
    this.rawHitzone = 100
    this.elmHitzone = 100
  }
}

module.exports = Monster
},{}],3:[function(require,module,exports){
class CLIParser {
  constructor() {
    this.maxArray = 20
    this.quit = false
    this.errmsg = "0"
  };

  regExpTest (regexp, string) {
    let re = new RegExp(regexp)
    return re.test(string)
  }

  parseError(errmsg) {
    this.quit = true
    this.errmsg = errmsg
    // console.log(this.errmsg)
    return
  }

  rawParse(string) {
    let raw = string.match(/\d{2,3}\b/)
    if (raw === null) {
      this.parseError("Unable to parse raw value of weapon")
      return
    } 
    else if (raw !== null) {
      if (raw[0].length === 3) {
        return parseInt(raw[0])
      } else {
        this.parseError("Unable to parse raw value of weapon")
        return
      }
    }
  }

  affParse(string) {
    let aff = string.match(/\d?\.?\d{1,3}\b/)
    if (aff === null) {
      this.parseError("Unable to parse affinity value of weapon")
    } 
    else if (aff !== null) {
      aff = parseFloat(aff)
      if (aff <= 1) {
        aff = aff * 100
        return parseInt(aff)
      } else if (aff > 1 && aff <= 100) {
        return parseInt(aff)
      } else {
        this.parseError("Unable to parse affinity value of weapon")
        return
      }
    }
  }

  auxParse(string) {
    let atkSkill = string.match(/(au([sml]))\b/)
    if (atkSkill === null) {
      this.parseError("Unable to parse AuX skill. Acceptable values are AuS/AuM/AuL.")
      return
    }
    else if (atkSkill !== null) {
      switch (atkSkill[2]) {
        case 's':
          return 10
        case 'm':
          return 15
        case 'l':
          return 20
        default:
          this.parseError("Unable to parse AuX skill. Acceptable values are AuS/AuM/AuL.")
          break
      }
    }
  }

  rawMultParse(string) {
    let rawMult = string.match(/x?(\d{1}\.\d{1,2})x?\b/)
    if (rawMult === null) {
      this.parseError("Unable to parse raw multiplier")
      return
    }
    else if (rawMult !== null) {
      return parseFloat(rawMult[1])
    }
  }

  addRawParse(string) {
    let rawAdd = string.match(/([\+\-])(\d{1,3})\b/)
    if (rawAdd === null) {
      this.parseError("Unable to parse additional raw")
      return
    } else if (rawAdd !== null) {
      switch (rawAdd[1]) {
        case "+":
          return parseInt(rawAdd[2])
        case "-":
          return 0 - parseInt(rawAdd[2])
        default:
          this.parseError("Unable to parse additional raw")
          break
      }
    } else {
      this.parseError('Unable to parse additional raw')
      return
    }
  }

  affSkillParse(string) {
    let availRanks = [1, 2, 3]
    let affSkill = string.match(/ce\+?(\d)\b/)
    if (affSkill === null) {
      this.parseError("Unable to parse CE skill")
      return
    } else {
      let affGainRank = parseInt(affSkill[1])
      if (availRanks.includes(affGainRank)) {
        return affGainRank * 10
      } else {
        this.parseError("CE Rank greater than 3")
        return
      }
    }
  }

  monHZParse(string) {
    let hitzone = string.match(/\d?\.?\d{1,3}\b/)
    if (hitzone === null) {
      this.parseError("Unable to parse monster raw hitzone")
    }
    hitzone = parseFloat(hitzone)
    // console.log(hitzone)
    if (hitzone < 2.0) {
      return parseInt(hitzone * 100)
    } else if (hitzone >= 2 && hitzone <= 200) {
      return parseInt(hitzone)
    } else {
      this.parseError("Unable to parse monster raw hitzone")
    }
  }

  parser(cliString, weapon, skills, monster) {
    let _data = cliString.split(",")
    if (_data.length > this.maxArray) {
      this.parseError("Data longer than tolerated max length")
      return
    }
    for (let i = 0; i < _data.length; i++) {
      if (this.quit !== false) { break }
      
      let _value = _data[i].trim().toLowerCase()
      
      if (_value.includes('raw') && weapon.raw === 0) {
        weapon.raw = this.rawParse(_value)
      } 

      else if (_value.includes('raw') && _value.includes('x')) {
        skills.rawMult = skills.rawMult * this.rawMultParse(_value)
      }
      
      else if (_value.includes('aff') && weapon.affinity === 0) {
        weapon.affinity = this.affParse(_value)
      } 
      
      else if (this.regExpTest(/we/, _value)) {
        skills.WE = true
      } 
      
      else if (this.regExpTest(/cb/, _value)) {
        skills.CB = true
      } 
      
      else if (_value.includes('au')) {
        skills.addRaw = skills.addRaw + this.auxParse(_value)
      }

      else if (_value.includes('ce')) {
        skills.addAff = skills.addAff + this.affSkillParse(_value)
      }

      else if (_value.includes('ehz') && monster.elmHitzone === 100) {
        monster.elmHitzone = this.monHZParse(_value)
      }

      else if (_value.includes('hz') && monster.rawHitzone === 100) {
        monster.rawHitzone = this.monHZParse(_value)
      }

      else if (this.regExpTest(/([\+\-])(\d{1,3})\b/, _value)) {
        skills.addRaw = skills.addRaw + this.addRawParse(_value)
      }

      else {
        this.parseError("A poorly formatted string was detected. Parsing quit")
      }
    }
  }
}

module.exports = CLIParser
},{}],4:[function(require,module,exports){
class Skills {
  constructor () {
    this.CB = false
    this.WE = false
    this.addRaw = 0
    this.addAff = 0
    this.rawMult = 1
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
}

module.exports = Skills
},{}],5:[function(require,module,exports){
class Weapon {
  constructor (str) {
    this.str = str
    this._raw = 0;
    this._element = 0;
    this._affinity = 0
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
},{}],6:[function(require,module,exports){
// import { Weapon } from "./models/weapon.js"
// import { CLIParser } from "./models/parser.js"
// import { Skills } from "./models/skills.js"
const damageCalculator = require("./damageCalculator")

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
    let dmg = new damageCalculator(elements['CLI'].value)
    resolve(dmg)
  })
  dataPromise.then((value) => {
    console.log(value.weaponStats())
    let str = `Effective Raw: ${value.effectiveRawCalc()} \n ----`
    let subDiv = document.createElement("div");
    subDiv.innerText = str;
    document.getElementById("output_div").prepend(subDiv);
  })
};




},{"./damageCalculator":1}]},{},[6]);
