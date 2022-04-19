import { copyArray, compareArray, getFrontExpression, getTerm, isFunction, isOperator } from './mylib.js';

let leftExpression = new Array(0);
let rightExpression = new Array(0);

function denominator(leftSide, rightSide) {
    leftExpression = copyArray(leftSide);
    rightExpression = copyArray(rightSide);

    while (getDenominatorIndex(leftExpression) != -1 || getDenominatorIndex(rightExpression) != -1) {
        removeDenominator();
    }
}

function removeDenominator() {
    let term = new Array(0);
    let remove = new Array(0);
    let denominator = new Array(0);
    let expression = new Array(0);
    let leftFinal = new Array(0);
    let rightFinal = new Array(0);

    for (let i = 0; i < leftExpression.length; i += term.length) {
        term = getTerm(i, leftExpression);
        denominator = getDenominator(term);
        if (denominator != "") {
            remove.push("*");
            remove = remove.concat(denominator);
        }
    }

    for (let i = 0; i < rightExpression.length; i += term.length) {
        term = getTerm(i, rightExpression);
        denominator = getDenominator(term);
        if (denominator != "") {
            remove.push("*");
            remove = remove.concat(denominator);
        }
    }

    let modifiedTerm = new Array(0);
    let modifiedRemove = new Array(0)

    for (let i = 0; i < leftExpression.length; i += term.length) {
        term = getTerm(i, leftExpression);

        modifiedTerm = copyArray(term);
        modifiedRemove = copyArray(remove);
        denominator = getDenominator(term);

        for (let n = remove.length - 1; n >= 0; n -= expression.length) {
            expression = getFrontExpression(n, remove);

            if (compareArray(denominator, expression)) {
                modifiedTerm.splice(getDenominatorIndex(term), denominator.length + 1);
                modifiedRemove.splice(n - expression.length, expression.length + 1);
                leftFinal = leftFinal.concat(modifiedTerm.concat(modifiedRemove));
                n = -1;
            }
            else if (n == 0 && !compareArray(denominator, expression)) {
                leftFinal = leftFinal.concat(term.concat(remove));
            }
        }
    }

    for (let i = 0; i < rightExpression.length; i += term.length) {
        term = getTerm(i, rightExpression);
        modifiedTerm = copyArray(term);
        modifiedRemove = copyArray(remove);
        denominator = getDenominator(term);
        for (let n = remove.length - 1; n >= 0; n -= expression.length) {
            expression = getFrontExpression(n, remove);
            if (compareArray(denominator, expression)) {
                modifiedTerm.splice(getDenominatorIndex(term), denominator.length + 1);
                modifiedRemove.splice(n - expression.length, expression.length + 1);
                rightFinal = rightFinal.concat(modifiedTerm.concat(modifiedRemove));
                n = -1;
            }
            else if (n == 0 && !compareArray(denominator, expression)) {
                rightFinal = rightFinal.concat(term.concat(remove));
            }
        }
    }

    leftExpression = copyArray(leftFinal);
    rightExpression = copyArray(rightFinal);
}

function getDenominator(array) {
    let brackets = 0;
    let end = -1;
    let start = 0;
    let maxBracket = 1000;

    let ignore = false;
    let bracket = 0;

    for (let i = 0; i < array.length; i++) {
        if (isFunction(array[i])) ignore = true;

        if (ignore) {
            if (array[i] == "(") bracket++;
            if (array[i] == ")") {
                bracket--;
                if (bracket == 0) ignore = false;
            }
        }
        else {
            if (array[i] == "(") brackets++;
            else if (array[i] == ")") brackets--;

            if (array[i] == "/" && brackets <= maxBracket) {
                start = i + 1;
                maxBracket = brackets;
            }
        }
    }

    let denominator = ("");

    if (start == 0) return denominator;

    brackets = 0;
    for (let i = start; i <= array.length && i >= 0; i++) {

        if (i == array.length && end == -1) {
            end = i;
        }

        if (array[i] == "(") brackets++;
        else if (brackets == 0 && isOperator(array[i])) {
            end = i;
            i = array.length;
        }
        else if (array[i] == ")") brackets--;
    }

    denominator = new Array(end - start);
    let index = 0;

    for (let i = start; i < end; i++) {
        denominator[index] = array[i];
        index++;
    }

    return denominator;
}

function getDenominatorIndex(array) {
    let brackets = 0;
    let start = -1;
    let maxBracket = 1000;

    let ignore = false;
    let bracket = 0;

    for (let i = 0; i < array.length; i++) {
        if (isFunction(array[i])) ignore = true;

        if (ignore) {
            if (array[i] == "(") bracket++;
            if (array[i] == ")") {
                bracket--;
                if (bracket == 0) ignore = false;
            }
        }
        else {
            if (array[i] == "(") brackets++;
            else if (array[i] == ")") brackets--;

            if (array[i] == "/" && brackets <= maxBracket) {
                start = i;
                maxBracket = brackets;
            }
        }
    }
    return start;
}

export { denominator, leftExpression, rightExpression };