import { variables } from './mylib.js';

const container = document.querySelector('#variables');
const input = document.querySelector('input');
const degRad = document.querySelector('#degRad');
const output = document.querySelector('.output');

let isDegree = true;

function getInput() {
    return input.value;
}

function createInputElements() {
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

function getInputElementsValues() {
    let tempValues = new Array(0);

    for (let i = 0; i < variables.length; i++) {
        tempValues.push(container.children[i].children[0].value);
    }

    return tempValues;
}

function resetContainer() {
    container.style.border = "2px solid black";

    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
}

function resetInput() {
    input.style.border = "2px solid black";
}

function resetDisplay() {
    output.textContent = "";
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

function setDisplay(string) {
    output.textContent = string;
}

function containerError() {
    container.style.border = "2px solid red";
}

function inputError() {
    input.style.border = "2px solid red";
}

function hasDisplay() {
    if(output.textContent == "") return false;
    else return true;
}

export { getInput, createInputElements, getInputElementsValues, degOrRad, resetContainer, resetInput, resetDisplay, setDisplay, containerError, inputError, hasDisplay, isDegree };