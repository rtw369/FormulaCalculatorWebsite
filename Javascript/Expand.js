import { cleanUp, copyArray, getTerm, getFrontExpression, getBackExpression, isFunction } from './mylib.js';
import { evaluate } from './Calculate.js';

function expand(array) {
    array = cleanUp(array);
    array = expandPower(array);
    array = expandBrackets(array);

    /*
    console.log("return");
    console.log(array);
    */
   
    return array;
}

function expandBrackets(array) {
    let bracket = 0;
    let numOfBrackets = 0;
    let lastBracketIndex = -1;
    let secondBracket = -1;

    let frontArray = new Array(0);
    let backArray = new Array(0);

    let ignore = false;
    let brackets = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == "/") ignore = true;
        if (isFunction(array[i])) {
            ignore = true;
        }

        if (ignore) {
            if (array[i] == "(") brackets++;
            if (array[i] == ")") {
                brackets--;
                if (brackets == 0) ignore = false;
            }
            //if (brackets == 0) ignore = false;
        }
        else {
            if (array[i] == "(") {
                bracket++;
                if (bracket > numOfBrackets) {
                    numOfBrackets = bracket;
                    secondBracket = lastBracketIndex;
                }
                if (bracket >= numOfBrackets) lastBracketIndex = i;
            }
            if (array[i] == ")") bracket--;
        }
    }

    bracket = 1;
    let end = -1;
    for (let i = secondBracket + 1; i <= array.length; i++) {
        if (i == array.length) end = i + 1;
        if (array[i] == "(") bracket++;
        if (array[i] == ")") {
            bracket--;
            if (bracket == 0) {
                end = i + 1;
                i = array.length + 1;
            }
        }
    }

    let expression = new Array(0);
    for (let i = secondBracket + 1; i < end - 1; i++) {
        expression.push(array[i]);
    }

    frontArray = array.slice(0, secondBracket + 1);
    backArray = array.slice(secondBracket + expression.length + 1);

    /*
    console.log("check");
    console.log(secondBracket);
    console.log(end);
    console.log(frontArray);
    console.log(expression);
    console.log(backArray);
    */

    let firstExpression = new Array(0);
    let secondExpression = new Array(0);
    let tempExpression = new Array(0);
    let firstTerm = new Array(0);
    let secondTerm = new Array(0);
    let length = 0;

    let getRidOfBrackets = false;

    firstExpression = getBackExpression(0, expression);

    /*
    console.log("before");
    console.log(array);
    console.log(expression);
    console.log(firstExpression);
    */

    if (firstExpression[0] == "(" && firstExpression.includes("/")) {
        getRidOfBrackets = true;
        brackets = 1;
        if (firstExpression[0] == "(" && firstExpression[firstExpression.length - 1] == ")") {
            for (let i = 1; i < firstExpression.length - 1; i++) {
                if (firstExpression[i] == "(") brackets++;
                if (firstExpression[i] == ")") brackets--;
                if (brackets == 0) getRidOfBrackets = false;
            }

            if (getRidOfBrackets) {
                length = firstExpression.length;
                tempExpression = firstExpression.slice(1, firstExpression.length - 1);
                firstExpression = getBackExpression(0, tempExpression);
                secondExpression = getBackExpression(firstExpression.length + 1, tempExpression);
                if(secondExpression[0] == "(") {
                    getRidOfBrackets = false;
                    firstExpression = getBackExpression(0, expression);
                }
            }
        }
    }

    if (!getRidOfBrackets) {
        tempExpression = new Array(0);
        if (firstExpression[0] == "(" && expression[firstExpression.length] == "/") {
            secondExpression = getBackExpression(firstExpression.length + 1, expression);
            length = firstExpression.length + 1 + secondExpression.length;
            tempExpression.push("(");

            firstExpression = firstExpression.slice(1, firstExpression.length - 1);

            for (let i = 0; i < firstExpression.length; i += firstTerm.length) {
                firstTerm = getTerm(i, firstExpression);
                tempExpression = tempExpression.concat(firstTerm);
                tempExpression.push("/");
                tempExpression = tempExpression.concat(secondExpression);
            }

            tempExpression.push(")");
        }
        else if (expression[firstExpression.length] == "/") {
            secondExpression = getBackExpression(firstExpression.length + 1, expression);
            backArray = array.slice(firstExpression.length + 1 + secondExpression.length);

            getRidOfBrackets = true;
            brackets = 1;
            if (secondExpression[0] == "(" && secondExpression[secondExpression.length - 1] == ")") {
                for (let i = 1; i < secondExpression.length - 1; i++) {
                    if (secondExpression[i] == "(") brackets++;
                    if (secondExpression[i] == ")") brackets--;
                    if (brackets == 0) getRidOfBrackets = false;
                }

                if (getRidOfBrackets) {
                    secondExpression = secondExpression.slice(1, secondExpression.length - 1);
                }
            }

            length = firstExpression.length + 1 + secondExpression;
            tempExpression.push("(");
            tempExpression = tempExpression.concat(firstExpression);
            tempExpression.push(")");
            tempExpression.push("/");
            tempExpression.push("(");
            tempExpression = tempExpression.concat(secondExpression);
            tempExpression.push(")");
        }
        else if (!(isFunction(firstExpression[0]))) {
            switch (expression[firstExpression.length]) {
                case "+":
                    secondExpression = expression.splice(firstExpression.length + 1);
                    secondExpression = expandBrackets(secondExpression);
                    length = firstExpression.length + 1 + secondExpression.length;

                    if (firstExpression[0] == "(") {
                        firstExpression = firstExpression.slice(1, firstExpression.length - 1);
                    }
                    if (secondExpression[0] == "(") {
                        secondExpression = secondExpression.slice(1, secondExpression.length - 1);
                    }

                    tempExpression = tempExpression.concat(firstExpression);

                    if (secondExpression[0] == "+") {
                        secondExpression.splice(0, 1);
                        tempExpression.push("+");
                    }
                    else if (secondExpression[0] == "-") {
                        secondExpression.splice(0, 1);
                        tempExpression.push("-");
                    }
                    else tempExpression.push("+");

                    tempExpression = tempExpression.concat(secondExpression);
                    break;

                case "-":
                    secondExpression = getBackExpression(firstExpression.length + 1, expression);
                    length = firstExpression.length + 1 + secondExpression.length;

                    if (secondExpression[0] == "(") {
                        secondExpression = secondExpression.slice(1, secondExpression.length - 1);
                    }

                    tempExpression = tempExpression.concat(firstExpression);
                    tempExpression.push("+");
                    tempExpression.push("(");

                    for (let i = 0; i < secondExpression.length; i += secondTerm.length) {
                        secondTerm = getTerm(i, secondExpression);
                        if (secondTerm[0] == "+") secondTerm[0] = "-";
                        else if (secondTerm[0] == "-") secondTerm[0] = "+";
                        else tempExpression.push("-");

                        tempExpression = tempExpression.concat(secondTerm);
                    }
                    tempExpression.push(")");
                    break;

                case "*":
                    tempExpression.push("(");
                    secondExpression = getBackExpression(firstExpression.length + 1, expression);
                    length = firstExpression.length + 1 + secondExpression.length;
                    firstExpression = cleanUp(firstExpression);
                    secondExpression = cleanUp(secondExpression);

                    if (firstExpression[0] == "(") {
                        firstExpression = firstExpression.slice(1, firstExpression.length - 1);
                    }
                    if (secondExpression[0] == "(") {
                        secondExpression = secondExpression.slice(1, secondExpression.length - 1);
                    }

                    for (let i = 0; i < firstExpression.length; i += firstTerm.length) {
                        firstTerm = getTerm(i, firstExpression);
                        for (let n = 0; n < secondExpression.length; n += secondTerm.length) {
                            secondTerm = getTerm(n, secondExpression);
                            if (tempExpression.length != 1) tempExpression.push("+");
                            tempExpression = tempExpression.concat(firstTerm);
                            tempExpression.push("*");
                            tempExpression = tempExpression.concat(secondTerm);
                        }
                    }
                    tempExpression.push(")");
                    break;

                case "(":
                    secondExpression = expression.slice(firstExpression.length);
                    firstExpression.push("*");
                    expression = firstExpression.concat(secondExpression);
                    break;

                default:
            }
        }
    }
    expression.splice(0, length);
    expression = tempExpression.concat(expression);

    let finalArray = new Array(0);

    getRidOfBrackets = true;
    brackets = 1;
    if (expression[0] == "(" && expression[expression.length - 1] == ")") {
        for (let i = 1; i < expression.length - 1; i++) {
            if (expression[i] == "(") brackets++;
            if (expression[i] == ")") brackets--;
            if (brackets == 0) getRidOfBrackets = false;
        }

        if (getRidOfBrackets) {
            expression = expression.slice(1, expression.length - 1);
        }
    }

    finalArray = finalArray.concat(frontArray);
    finalArray = finalArray.concat(expression);
    finalArray = finalArray.concat(backArray);

    finalArray = cleanUp(finalArray);

    /*
    console.log("after");
    console.log(frontArray);
    console.log(expression);
    console.log(backArray);
    console.log(finalArray);
    */

    getRidOfBrackets = true;
    brackets = 1;
    if (finalArray[0] == "(" && finalArray[finalArray.length - 1] == ")") {
        for (let i = 1; i < finalArray.length - 1; i++) {
            if (finalArray[i] == "(") brackets++;
            if (finalArray[i] == ")") brackets--;
            if (brackets == 0) getRidOfBrackets = false;
        }

        if (getRidOfBrackets) {
            finalArray = finalArray.slice(1, finalArray.length - 1);
        }
    }

    ignore = false;
    brackets = 0;

    for (let i = 0; i < finalArray.length; i++) {
        if (finalArray[i] == "/") {
            ignore = true;
        }
        else if (isFunction(finalArray[i])) {
            ignore = true;
        }

        if (ignore) {
            if (finalArray[i] == "(") brackets++;
            if (finalArray[i] == ")") {
                brackets--;
                if (brackets == 0) ignore = false;
            }
            //if (brackets == 0) ignore = false;
        }
        else {
            if (finalArray[i] == "(") {
                i = 0;
                finalArray = expandBrackets(finalArray);
            }
        }
    }

    return finalArray;
}

function expandPower(array) {
    let frontExpression = new Array(0);
    let backExpression = new Array(0);
    let frontArray = new Array(0);
    let backArray = new Array(0);
    let finalArray = copyArray(array);
    let powerIndex = finalArray.indexOf("^");

    while (powerIndex != -1) {
        frontExpression = getFrontExpression(powerIndex - 1, finalArray);
        backExpression = getBackExpression(powerIndex + 1, finalArray);
        let power = evaluate(backExpression);
        frontArray = finalArray.slice(0, powerIndex - frontExpression.length);
        backArray = finalArray.slice(powerIndex + backExpression.length + 1);

        if (power == 0) {
            frontArray.push("(");
            frontArray.push("1");
            frontArray.push(")");
            finalArray = frontArray.concat(backArray);
            powerIndex = finalArray.indexOf("^");
        }
        else if (power < 0) {
            frontArray.push("(");
            frontArray.push("1");
            frontArray.push("/");
            frontArray = frontArray.concat(frontExpression);
            frontArray.push("^");
            frontArray.push(Math.abs(power));
            frontArray.push(")");

            finalArray = frontArray.concat(backArray);
            powerIndex = finalArray.indexOf("^");
        }
        else {
            frontArray.push("(");
            frontArray = frontArray.concat(frontExpression);

            for (let i = 1; i < power; i++) {
                frontArray.push("*");
                frontArray = frontArray.concat(frontExpression);
            }

            frontArray.push(")");
            finalArray = frontArray.concat(backArray);
            powerIndex = finalArray.indexOf("^");
        }
    }

    return finalArray;
}

export { expand, expandBrackets };