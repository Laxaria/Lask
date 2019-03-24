// import { Weapon } from "./models/weapon.js"
// import { CLIParser } from "./models/parser.js"
// import { Skills } from "./models/skills.js"
import { damageCalculator } from "./damageCalculator.js"

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
        input.type = "text";
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



