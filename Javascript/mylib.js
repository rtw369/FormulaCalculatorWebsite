import { variableError } from './DOM.js';
import { createArray } from './FormulaArray.js';

let variables = new Array(0);
let variable = "x";
let values = new Array(0);

let errorMsg = "ERROR! More than one unknown variables.";

function reset() {
    values = new Array(0);
    variable = "";
}

function resetVariables() {
    variables = new Array(0);
}

function cleanUp(array) {
    for (let i = 1; i < array.length - 1; i++) {
        if (array[i] == "+") {
            if (array[i - 1] != ")" && array[i + 1] != "(") {
                if (isOperator(array[i - 1]) || isOperator(array[i + 1])) {
                    array.splice(i, 1);
                    i = 0;
                }
            }
        }
    }
    return array;
}

function getValue(string) {
    let result;

    if (isVariable(string)) {
        if (string == variable) result = variable;
        else {
            for (let i = 0; i < variables.length; i++) {
                if (string == variables[i]) {
                    result = values[i];
                    i = variables.length;
                }
                else result = NaN;
            }
        }
    }
    else if (isOperator(string)) {
        result = NaN;
    }
    else if (string == "Pi") result = Math.PI;
    else if (string == "E") result = Math.E;
    else {
        result = parseFloat(string);
    }

    return result;
}

function getTerm(start, array) {
    let brackets = 0;
    let end = -1;
    let skip = false;

    for (let i = start; i <= array.length; i++) {
        if (i == array.length && end == -1) end = i;

        if (array[i] == "(") brackets++;
        else if (array[i] == ")") brackets--;

        if (array[i] == "*") skip = true;


        if (i != start && (array[i] == "-" || array[i] == "+") && brackets == 0) {
            if (!skip) {
                end = i;
                i = array.length;
            }
        }

        if (array[i] != "*") skip = false;
    }

    let term = new Array(end - start);
    let termIndex = 0;

    for (let i = start; i < end; i++) {
        term[termIndex] = array[i];
        termIndex++;
    }

    return term;
}

function getFrontExpression(end, array) {
    let brackets = 0;
    let start = -1;

    for (let i = end; i >= 0; i--) {
        if (i == 0 && start == -1) start = i;

        if (array[i] == ")") brackets++;

        if (brackets == 0 && isOperator(array[i]) && i == end) return array[i];
        else if (isOperator(array[i]) && brackets == 0) {
            start = i + 1;
            i = -1;
        }

        if (array[i] == "(") brackets--;
    }

    let expression = new Array(end - start);
    let expressionIndex = 0;

    for (let i = start; i <= end; i++) {
        expression[expressionIndex] = array[i];
        expressionIndex++;
    }

    return expression;
}

function getBackExpression(start, array) {
    let brackets = 0;
    let end = -1;

    let ignore = false;
    let bracket = 0;

    for (let i = start; i <= array.length; i++) {
        if (i == array.length) end = i;
        if (isFunction(array[start])) ignore = true;

        if (ignore) {
            if (array[i] == "(") bracket++;
            if (array[i] == ")") {
                bracket--;
                if (bracket == 0) end = i;
            }
            if (i == array.length) end = i;
        }
        else {
            if (array[i] == "(") brackets++;
            if (isOperator(array[i])) {
                if (i != start && brackets == 0) {
                    end = i;
                    i = array.length + 1;
                }
                else if (i != start && brackets == 1 && array[i] == "(") {
                    end = i;
                    i = array.length + 1;
                }
                else if (brackets == 1 && array[i] == ")") {
                    end = i + 1;
                    i = array.length + 1;
                }
            }
            if (array[i] == ")") brackets--;
        }
    }
    let expression = new Array(end - start);
    let expressionIndex = 0;
    for (let i = start; i < end; i++) {
        expression[expressionIndex] = array[i];
        expressionIndex++;
    }

    return expression;
}

function isOperator(string) {
    if (string === "+") return true;
    else if (string === "-") return true;
    else if (string === "*") return true;
    else if (string === "/") return true;
    else if (string === "(") return true;
    else if (string === ")") return true;
    else return false;
}

function isFunction(string) {
    if (string == "sin") return true;
    else if (string == "cos") return true;
    else if (string == "tan") return true;
    else if (string == "asin") return true;
    else if (string == "acos") return true;
    else if (string == "atan") return true;
    else return false;
}

function copyArray(array) {
    let result = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
        result[i] = array[i];
    }

    return result;
}

function setVariables(array) {
    let isVariable = false;
    let exceptions = "1234567890+-=/*^()E";

    for (let i = 0; i < array.length; i++) {
        isVariable = true;

        for (let n = 0; n < exceptions.length; n++) {
            if (array[i].charAt(0) == exceptions.charAt(n)) {
                isVariable = false;
            }
        }
        for (let n = 0; n < variables.length; n++) {
            if (array[i] == variables[n]) {
                isVariable = false;
            }
        }

        if (array[i].length == 2 && array[i] == "Pi") isVariable = false;
        else if (array[i].length == 3) {
            if (array[i] == "sin") isVariable = false;
            else if (array[i] == "cos") isVariable = false;
            else if (array[i] == "tan") isVariable = false;
        }
        else if (array[i].length == 4) {
            if (array[i] == "asin") isVariable = false;
            else if (array[i] == "acos") isVariable = false;
            else if (array[i] == "atan") isVariable = false;
        }

        if (isVariable) {
            variables.push(array[i]);
        }
    }
}

function setValues(array) {
    values = copyArray(array);
}

function setUnknownVariable() {
    for (let i = 0; i < values.length; i++) {
        values[i] = removeSpaces(values[i]);
        if (values[i] == "") {
            if (variable == "") {
                variable = variables[i];
            }
            else {
                variableError(errorMsg);
                i = variables.length;
                values = new Array(0);
            }
        }
    }
}

function isVariable(string) {
    for (let i = 0; i < variables.length; i++) {
        if (string == variables[i]) return true;
    }
    return false;
}

function compareArray(array1, array2) {
    if (array1.length != array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) return false;
    }
    return true;
}

function removeSpaces(formula) {
    let result = formula.replaceAll(" ", "");
    return result;
}

function replaceVariables(array) {
    let repeat = true;
    while (repeat) {
        repeat = false;
        let expression = "";

        for (let i = 0; i < array.length; i++) {
            if (isVariable(array[i]) && array[i] != variable) {
                expression += "(";
                expression += getValue(array[i]);
                expression += ")";
            }
            else {
                expression += array[i];
            }
        }

        array = createArray(expression);

        for (let i = 0; i < array.length; i++) {
            if (array[i] == variable) i++;
            else if (isVariable(array[i])) repeat = true;
        }
    }

    return array;
}

export {
    reset, resetVariables, cleanUp, copyArray, compareArray, removeSpaces,
    getTerm, getFrontExpression, getBackExpression, getValue,
    isOperator, isFunction, replaceVariables,
    setVariables, setValues, setUnknownVariable,
    variables, variable, values
};