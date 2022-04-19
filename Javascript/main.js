import { initializeFormula, leftExpression as left1, rightExpression as right1 } from './FormulaArray.js';
import { expand } from './Expand.js';
import { reset, resetVariables, copyArray, setVariables, setValues, setUnknownVariable, replaceVariables, variables, variable } from './mylib.js';
import { denominator, leftExpression as left2, rightExpression as right2 } from './Denominator.js';
import { rearrange } from './Rearrange.js';
import { getInput, createInputElements, getInputElementsValues, resetContainer, degOrRad } from './DOM.js';

const inputBtn = document.querySelector('#inputBtn');
const calculateBtn = document.querySelector('#calculate');
const degRad = document.querySelector('#degRad');

let leftSide;
let rightSide;

let errorMsg1 = "ERROR! Formula does not contain equal sign.";
let errorMsg2 = "ERROR! All variables are known.";
let errorMsg3 = "ERROR! Cannot find a variable.";

degRad.addEventListener('click', () => degOrRad());

inputBtn.addEventListener('click', () => {
    initialReset();

    let formula = getInput();

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
        createInputElements();
    }
});

calculateBtn.addEventListener('click', () => {
    valueReset();

    setValues(getInputElementsValues());

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
});

function initialReset() {
    leftSide = left1;
    rightSide = right1;
    resetVariables();
    reset();
    resetContainer();
}

function valueReset() {
    leftSide = left1;
    rightSide = right1;
    reset();
}