import {getValue, isFunction, isOperator} from './mylib.js';
import {isDegree} from './DOM.js';

let errorMsg = "ERROR! Cannot divide by 0."

function evaluate(array) {
    let brackets = 0;
    let start = -1;
    let value;
    let result = new Array(0);

    let frontArray = new Array(0);
    let backArray = new Array(0);

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "(") {
            if (brackets == 0) {
                start = i;
            }
            brackets++;
        }
        if (array[i] == ")") {
            brackets--;
            if (brackets == 0) {
                frontArray = array.slice(0, start);
                backArray = array.slice(i + 1);
                value = evaluate(array.slice(start + 1, i));
                frontArray.push(value);
                array = frontArray.concat(backArray);
                i = 0;
            }
        }
    }

    // no exponents
    for (let i = 0; i < array.length; i++) {
        if (isFunction(array[i])) {
            value = evaluateFunctions(array[i], array[i + 1]);
            array.splice(i, 2, value);
        }
    }

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "/") {
            if (getValue(array[i + 1]) == 0) {
                alert(errorMsg);
            }
            value = getValue(array[i - 1]) / getValue(array[i + 1]);
            array.splice(i - 1, 3, value);
            i = 0;
        }
        else if (array[i] == "*") {
            if (array[i + 1] == "-") {
                value = getValue(array[i - 1]) * -1;
                array.splice(i - 1, 1, value);
                array.splice(i + 1, 1);
            }
            if (array[i - 1] == "-") {
                array[i - 1] = -1;
            }
            value = getValue(array[i - 1]) * getValue(array[i + 1]);
            array.splice(i - 1, 3, value);
            i = 0;
        }
    }

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "-") {
            if (array[i - 1] == undefined) {
                if (isOperator(array[i + 1])) {
                    value = 0;
                    array.splice(i, 1, value);
                }
                else {
                    value = 0 - getValue(array[i + 1]);
                    array.splice(i, 2, value);
                }
            }
            else {
                value = getValue(array[i - 1]) - getValue(array[i + 1]);
                array.splice(i - 1, 3, value);
            }
            i = 0;
        }
        else if (array[i] == "+") {
            if (array[i - 1] == undefined) {
                if (isOperator(array[i + 1])) {
                    value = 0;
                    array.splice(i, 1, value);
                }
                else {
                    value = 0 + getValue(array[i + 1]);
                    array.splice(i, 2, value);
                }
            }
            else {
                value = getValue(array[i - 1]) + getValue(array[i + 1]);
                array.splice(i - 1, 3, value);
            }
            i = 0;
        }
    }
    result = array[0];
    return result;
}

function evaluateFunctions(operator, value) {
    let result;
    value = getValue(value);

    switch (operator) {
        case "sin":
        case "cos":
        case "tan":
            if (isDegree) value = value * (Math.PI / 180);
            break;
        default:
    }

    switch (operator) {
        case "sin":
            result = Math.sin(value);
            break;

        case "cos":
            result = Math.cos(value);
            break;

        case "tan":
            result = Math.tan(value);
            break;

        case "asin":
            result = Math.asin(value);
            break;

        case "acos":
            result = Math.acos(value);
            break;

        case "atan":
            result = Math.atan(value);
            break;

        default:
    }

    if (result <= 0.0000000001 && result > 0) result = 0;

    switch (operator) {
        case "asin":
        case "acos":
        case "atan":
            if (isDegree) result = result * (180 / Math.PI);
            break;

        default:
    }

    return result;
}

export {evaluate};