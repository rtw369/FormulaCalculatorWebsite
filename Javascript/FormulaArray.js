import { removeSpaces } from './mylib.js';

let leftExpression = new Array(0);
let rightExpression = new Array(0);

function initializeFormula(formula) {
    divideFormula(removeSpaces(formula));
    leftExpression = createArray(leftExpression);
    rightExpression = createArray(rightExpression);
}

function divideFormula(formula) {
    let indexOfEqual = formula.indexOf("=");
    leftExpression = formula.substring(0, indexOfEqual);
    rightExpression = formula.substring(indexOfEqual + 1);
}

function createArray(expression) {
    let modifiedExpression = "";

    for (let i = 0; i < expression.length; i++) {
        switch (expression.substr(i, 4)) {
            case "asin":
            case "acos":
            case "atan":
                modifiedExpression += " " + expression.substr(i, 4) + " ";
                i += 4;
                break;
            default:
        }

        switch (expression.substr(i, 3)) {
            case "sin":
            case "cos":
            case "tan":
                modifiedExpression += " " + expression.substr(i, 3) + " ";
                i += 3;
                break;

            default:
        }

        switch (expression.substr(i, 2)) {
            case "Pi":
                modifiedExpression += " " + expression.substr(i, 2) + " ";
                i += 2;
                break;

            default:
        }

        switch (expression.substr(i, 1)) {
            case "+":
            case "-":
            case "*":
            case "/":
            case "^":
            case "(":
            case ")":
            case "E":
                modifiedExpression += " " + expression.substr(i, 1) + " ";
                break;

            default:
                modifiedExpression += expression.substr(i, 1);
                break;
        }
    }

    let finalArray = modifiedExpression.split(" ");

    for (let i = 0; i < finalArray.length; i++) {
        if (finalArray[i] === "") {
            finalArray.splice(i, 1);
        }
    }

    return finalArray;
}

export { initializeFormula, createArray, leftExpression, rightExpression };