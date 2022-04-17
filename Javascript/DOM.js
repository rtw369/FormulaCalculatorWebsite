import { initializeFormula, leftExpression as left1, rightExpression as right1 } from './FormulaArray.js';
import { expand } from './Expand.js';
import { reset, resetVariables, copyArray, setVariables, setValues, setUnknownVariable, replaceVariables, variables, variable, values} from './mylib.js';
import { denominator, leftExpression as left2, rightExpression as right2 } from './Denominator.js';
import { rearrange } from './Rearrange.js';

const container = document.querySelector('#variables');
const input = document.querySelector('input');
const degRad = document.querySelector('#degRad');

let leftSide;
let rightSide;
let tempValues = new Array(0);
let isDegree = true;

let errorMsg1 = "ERROR! Formula does not contain equal sign.";
let errorMsg2 = "ERROR! All variables are known.";
let errorMsg3 = "ERROR! Cannot find a variable.";

function initialize() {
    resetAll();

    let formula = input.value;

    if (!(formula.includes("="))) {
        alert(errorMsg1);
    }
    else {
        initializeFormula(formula);
        leftSide = left1;
        rightSide = right1;

        setVariables(leftSide);
        setVariables(rightSide);
    }

    if (variables.length == 0) {
        alert(errorMsg3);
    }
    else {
        variables.forEach(value => {
            const valueDiv = document.createElement('div');
            valueDiv.classList.add('values');
            valueDiv.textContent = value;
            container.appendChild(valueDiv);

            const valueInput = document.createElement('input');
            valueInput.classList.add('valueInput');
            valueDiv.appendChild(valueInput);
        });
    }
}

function calculate() {
    leftSide = left1;
    rightSide = right1;
    tempValues = new Array(0);
    reset();

    for (let i = 0; i < variables.length; i++) {
        tempValues.push(container.children[i].children[0].value);
    }

    setValues(tempValues);

    setUnknownVariable();

    if (variable == "") {
        alert(errorMsg2);
    }
    else {
        leftSide = replaceVariables(leftSide);
        rightSide = replaceVariables(rightSide);

        leftSide = expand(leftSide);
        rightSide = expand(rightSide);

        denominator(leftSide, rightSide);
        leftSide = copyArray(left2);
        rightSide = copyArray(right2);

        let result = rearrange(leftSide, rightSide);
        alert(result);
    }
}

function degOrRad() {
    isDegree = !isDegree;

    if (isDegree) {
        degRad.textContent = "deg";
    }
    else {
        degRad.textContent = "rad";
    }
}

function resetAll() {
    leftSide = left1;
    rightSide = right1;
    resetVariables();
    reset();

    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
}

export {initialize, calculate, degOrRad, isDegree};