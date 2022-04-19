import { copyArray, getTerm, cleanUp, isFunction, isOperator, variable } from './mylib.js';
import { expandBrackets as expand } from './Expand.js';
import { evaluate } from './Calculate.js';

let leftFinal = new Array(0);
let rightFinal = new Array(0);

function rearrange(leftSide, rightSide) {
    leftFinal = copyArray(leftSide);
    rightFinal = copyArray(rightSide);

    let result = checkQuadratic();
    if (Math.abs(result) == 0) result = Math.abs(result);
    return result;
}

function checkQuadratic() {
    let term = new Array(0);
    let tempExpression = new Array(0);
    let hasVariable = true;

    for (let i = 0; i < leftFinal.length; i += term.length) {
        term = getTerm(i, leftFinal);
        if (!(term.includes(variable))) {
            hasVariable = false;
        }
    }
    for (let i = 0; i < rightFinal.length; i += term.length) {
        term = getTerm(i, rightFinal);
        if (!(term.includes(variable))) {
            hasVariable = false;
        }
    }

    if (hasVariable) {
        for (let i = 0; i < leftFinal.length; i += term.length) {
            term = getTerm(i, leftFinal);
            term.splice(term.indexOf(variable), 1, 1);
            tempExpression = tempExpression.concat(term);
        }
        leftFinal = copyArray(tempExpression);
        tempExpression = new Array(0);
        for (let i = 0; i < rightFinal.length; i += term.length) {
            term = getTerm(i, rightFinal);
            term.splice(term.indexOf(variable), 1, 1);
            tempExpression = tempExpression.concat(term);
        }
        rightFinal = copyArray(tempExpression);
    }


    term = new Array(0);
    let count;
    let quadratic = false;

    for (let i = 0; i < leftFinal.length; i += term.length) {
        term = getTerm(i, leftFinal);
        count = 0;
        for (let n = 0; n < term.length; n++) {
            if (term[n] == variable) {
                count++;
            }
        }
        if (count == 2) {
            quadratic = true;
        }
    }

    for (let i = 0; i < rightFinal.length; i += term.length) {
        term = getTerm(i, rightFinal);
        count = 0;
        for (let n = 0; n < term.length; n++) {
            if (term[n] == variable) {
                count++;
            }
        }
        if (count == 2) {
            quadratic = true;
        }
    }

    if (quadratic) {
        return solveQuadratic();
    }
    else {
        return moveTerm();
    }
}

function solveQuadratic() {
    let a = new Array(0);
    let b = new Array(0);
    let c = new Array(0);
    let term = new Array(0);
    let count = 0;
    let tempTerm = new Array(0);

    a.push(0);
    b.push(0);
    c.push(0);

    for (let i = 0; i < leftFinal.length; i += term.length) {
        term = getTerm(i, leftFinal);
        tempTerm = new Array(0);
        count = 0;
        for (let n = 0; n < term.length; n++) {
            if (term[n] == variable) {
                count++;
                tempTerm.push("1");
            }
            else tempTerm.push(term[n]);
        }
        if (count == 2) {
            a.push("+");
            a = a.concat(tempTerm);
        }
        else if (count == 1) {
            b.push("+");
            b = b.concat(tempTerm);
        }
        else if (count == 0) {
            c.push("+");
            c = c.concat(tempTerm);
        }
        else;
    }

    for (let i = 0; i < rightFinal.length; i += term.length) {
        term = getTerm(i, rightFinal);
        tempTerm = new Array(0);
        count = 0;
        for (let n = 0; n < term.length; n++) {
            if (term[n] == variable) {
                count++;
                tempTerm.push("1");
            }
            else tempTerm.push(term[n]);
        }
        if (count == 2) {
            a.push("-");
            a = a.concat(tempTerm);
        }
        else if (count == 1) {
            b.push("-");
            b = b.concat(tempTerm);
        }
        else if (count == 0) {
            c.push("-");
            c = c.concat(tempTerm);
        }
        else;
    }

    a = expand(a);
    b = expand(b);
    c = expand(c);

    a = evaluate(a);
    b = evaluate(b);
    c = evaluate(c);

    if (a == 0 || a == NaN) {
        return moveTerm();
    }
    else {
        let firstResult = (- b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        let secondResult = (- b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);

        let result = firstResult + "\nor\n" + secondResult;
        return result;
    }
}

function moveTerm() {
    let leftExpression = new Array(0);
    let rightExpression = new Array(0);
    let tempTerm = new Array(0);
    let tempExpression = new Array(0);

    for (let i = 0; i < leftFinal.length; i += tempTerm.length) {
        tempTerm = getTerm(i, leftFinal);
        if (tempTerm.includes(variable)) {
            leftExpression.push("+");
            leftExpression.push("(");
            leftExpression = leftExpression.concat(tempTerm);
            leftExpression.push(")");
        }
        else {
            rightExpression.push("-");
            rightExpression.push("(");
            rightExpression = rightExpression.concat(tempTerm);
            rightExpression.push(")");
        }
    }

    for (let i = 0; i < rightFinal.length; i += tempTerm.length) {
        tempTerm = getTerm(i, rightFinal);
        if (tempTerm.includes(variable)) {
            leftExpression.push("-");
            leftExpression.push("(");
            leftExpression = leftExpression.concat(tempTerm);
            leftExpression.push(")");
        }
        else {
            rightExpression.push("+");
            rightExpression.push("(");
            rightExpression = rightExpression.concat(tempTerm);
            rightExpression.push(")");
        }
    }

    leftExpression = cleanUp(leftExpression);
    rightExpression = cleanUp(rightExpression);

    if (leftExpression[0] == "+") leftExpression.shift();
    if (rightExpression[0] == "+") rightExpression.shift();

    leftExpression = expand(leftExpression);
    rightExpression = expand(rightExpression);

    let ignore = false;
    let brackets = 0;
    let tempLeftExpression = new Array(0);

    if (leftExpression.length != 0) {

        tempExpression.push("(");

        for (let i = 0; i < leftExpression.length; i++) {
            if (isFunction(leftExpression[i])) {
                for (let n = i; n < leftExpression.length; n++) {
                    if (leftExpression[n] == "(") brackets++;
                    if (leftExpression[n] == ")") {
                        brackets--;
                        if (brackets == 0) n = leftExpression.length;
                    }
                    if (leftExpression[n] == variable) ignore = true;
                }
            }

            if (ignore) {
                tempLeftExpression.push(leftExpression[i]);
                if (leftExpression[i] == "(") brackets++;
                if (leftExpression[i] == ")") {
                    brackets--;
                    if (brackets == 0) ignore = false;
                }
            }
            else {
                if (leftExpression[i] == variable) {
                    tempExpression.push("1");
                }
                else {
                    tempExpression.push(leftExpression[i]);
                }
            }
        }

        if (isOperator(tempExpression[tempExpression.length - 1])) tempExpression.pop();

        tempExpression.push(")");

        rightExpression.unshift("(");
        rightExpression.push(")");
        rightExpression.push("/");
        rightExpression = rightExpression.concat(tempExpression);

        leftExpression = copyArray(tempLeftExpression);

        if (isFunction(leftExpression[0])) {
            rightExpression.unshift("(");
            rightExpression.push(")");

            switch (leftExpression[0]) {
                case "sin":
                    rightExpression.unshift("asin");
                    break;

                case "cos":
                    rightExpression.unshift("acos");
                    break;

                case "tan":
                    rightExpression.unshift("atan");
                    break;

                case "asin":
                    rightExpression.unshift("sin");
                    break;

                case "acos":
                    rightExpression.unshift("cos");
                    break;

                case "atan":
                    rightExpression.unshift("tan");
                    break;

                default:
            }
            leftExpression.shift();
            leftExpression = expand(leftExpression);

            leftFinal = copyArray(leftExpression);
            rightFinal = copyArray(rightExpression);

            return moveTerm();
        }
    }

    return evaluate(rightExpression);
}

export { rearrange };