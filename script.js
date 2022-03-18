let formula1 = "(2*(x-4))/x = 6";
let formula2 = "(2+2)/(3) = 6";
let formula3 = "(4-(x/3)) = 2";

let leftSide = "";
let rightSide = "";
let variables = new Array(0);
let values = new Array(0);
let variable = "x";

execute(formula1);

function execute(formula) {
    divideFormula(removeSpaces(formula));
    leftSide = createArray(leftSide);
    rightSide = createArray(rightSide);

    setVariables(leftSide);
    setVariables(rightSide);

    leftSide = cleanUp(leftSide);
    rightSide = cleanUp(rightSide);

    leftSide = expandPower(leftSide);
    rightSide = expandPower(rightSide);

    leftSide = expand(leftSide);
    rightSide = expand(rightSide);

    while (leftSide.indexOf("/") != -1 || rightSide.indexOf("/") != -1) {
        removeDenominator();
    }

    console.log(leftSide);
    console.log(rightSide);

    // check if quadratic equation is applicable
    let result = checkQuadratic();
    if (Math.abs(result) == 0) result = Math.abs(result);
    console.log(result);
    return result;

}

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
    // yes functions though

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "/") {
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

function getValue(string) {
    let result;

    if (isVariable(string)) {
        for (let i = 0; i < variables.length; i++) {
            if (string == variables[i]) {
                result = values[i];
            }
            else result = NaN;
        }
    }
    else if (isOperator(string)) {
        result = NaN;
    }
    else {
        result = parseFloat(string);
    }

    return result;
}

function moveTerm() {
    let leftExpression = new Array(0);
    let rightExpression = new Array(0);
    let tempTerm = new Array(0);
    let tempExpression = new Array(0);

    for (let i = 0; i < leftSide.length; i += tempTerm.length) {
        tempTerm = getTerm(i, leftSide);
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

    for (let i = 0; i < rightSide.length; i += tempTerm.length) {
        tempTerm = getTerm(i, rightSide);
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

    console.log(leftExpression);
    console.log(rightExpression);
    console.log("after");

    leftExpression = expand(leftExpression);
    console.log(leftExpression);
    rightExpression = expand(rightExpression);
    console.log(rightExpression);

    if (leftExpression.length != 0) {
        tempExpression.push("(");
        for (let i = 0; i < leftExpression.length; i++) {
            if (leftExpression[i] == variable) {
                tempExpression.push("1");
            }
            else tempExpression.push(leftExpression[i]);
        }

        tempExpression.push(")");

        rightExpression.unshift("(");
        rightExpression.push(")");
        rightExpression.push("/");
        rightExpression = rightExpression.concat(tempExpression);
    }

    return evaluate(rightExpression);
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

function expand(array) {
    let bracket = 0;
    let numOfBrackets = 0;
    let lastBracketIndex = -1;
    let secondBracket = -1; // start index of second most inner bracket

    let frontArray = new Array(0);
    let backArray = new Array(0);

    //find secondBracket
    for (let i = 0; i < array.length; i++) {
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

    //get the every expressions within the brackets
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

    let firstExpression = new Array(0);
    let secondExpression = new Array(0);
    let tempExpression = new Array(0);
    let firstTerm = new Array(0);
    let secondTerm = new Array(0);
    let length = 0;

    tempExpression = new Array(0);
    length = 0;
    firstExpression = getBackExpression(0, expression);

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
    else {
        switch (expression[firstExpression.length]) {
            case "+":
                secondExpression = expression.splice(firstExpression.length + 1);
                secondExpression = expand(secondExpression);
                tempExpression.push("(");
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

                tempExpression.push(")");
                break;

            case "-":
                secondExpression = getBackExpression(firstExpression.length + 1, expression);
                length = firstExpression.length + 1 + secondExpression.length;

                if (firstExpression.length > 0 && firstExpression[0] != "(") {
                    firstExpression.unshift("(");
                    firstExpression.push(")");
                }
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

            case undefined:
                if (firstExpression[0] == "(") {
                    firstExpression = firstExpression.slice(1, firstExpression.length - 1);
                }
                expression = copyArray(firstExpression);
                break;

            default:
        }
    }
    expression.splice(0, length);
    expression = tempExpression.concat(expression);

    let finalArray = new Array(0);
    finalArray = finalArray.concat(frontArray);
    finalArray = finalArray.concat(expression);
    finalArray = finalArray.concat(backArray);

    finalArray = cleanUp(finalArray);

    if (finalArray[0] == "(" && finalArray[finalArray.length - 1] == ")") {
        finalArray = finalArray.slice(1, finalArray.length - 1);
    }

    bracket = 0;
    let isDenom = false;

    for (i = 0; i < finalArray.length; i++) {
        if (finalArray[i] == "/") {
            isDenom = true;
        }

        if (isDenom) {
            if (finalArray[i] == "(") bracket++;
            if (finalArray[i] == ")") {
                bracket--;
                if (bracket == 0) {
                    isDenom = false;
                }
            }
        }
        else {
            if (finalArray[i] == "(") {
                i = 0;
                finalArray = expand(finalArray);
            }
        }
    }

    return finalArray;
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

function checkQuadratic() {
    //get rid of excess variable
    let term = new Array(0);
    let tempExpression = new Array(0);
    let hasVariable = true;

    for(let i = 0; i < leftSide.length; i += term.length) {
        term = getTerm(i, leftSide);
        if(!(term.includes(variable))) {
            hasVariable = false;
        }
    }
    for(let i = 0; i < rightSide.length; i += term.length) {
        term = getTerm(i, rightSide);
        if(!(term.includes(variable))) {
            hasVariable = false;
        }
    }

    if(hasVariable) {
        for(let i = 0; i < leftSide.length; i += term.length) {
            term = getTerm(i, leftSide);
            term.splice(term.indexOf(variable), 1, 1);
            tempExpression = tempExpression.concat(term);
        }
        leftSide = copyArray(tempExpression);
        tempExpression = new Array(0);
        for(let i = 0; i < rightSide.length; i += term.length) {
            term = getTerm(i, rightSide);
            term.splice(term.indexOf(variable), 1, 1);
            tempExpression = tempExpression.concat(term);
        }
        rightSide = copyArray(tempExpression);
    }

        
    term = new Array(0);
    let count;
    let quadratic = false;

    for (let i = 0; i < leftSide.length; i += term.length) {
        term = getTerm(i, leftSide);
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

    for (let i = 0; i < rightSide.length; i += term.length) {
        term = getTerm(i, rightSide);
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

    for (let i = 0; i < leftSide.length; i += term.length) {
        term = getTerm(i, leftSide);
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

    for (let i = 0; i < rightSide.length; i += term.length) {
        term = getTerm(i, rightSide);
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
        let firstResult = (- b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / 2 * a;
        let secondResult = (- b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / 2 * a;

        let result = firstResult + "\nor\n" + secondResult;
        return result;
    }
}

function removeDenominator() {
    let term = new Array(0);
    let remove = new Array(0);
    let denominator = new Array(0);
    let expression = new Array(0);
    let leftFinal = new Array(0);
    let rightFinal = new Array(0);

    for (let i = 0; i < leftSide.length; i += term.length) {
        term = getTerm(i, leftSide);
        denominator = getDenominator(term);
        if (denominator != "") {
            remove.push("*");
            remove = remove.concat(denominator);
        }
    }

    for (let i = 0; i < rightSide.length; i += term.length) {
        term = getTerm(i, rightSide);
        denominator = getDenominator(term);
        if (denominator != "") {
            remove.push("*");
            remove = remove.concat(denominator);
        }
    }

    let modifiedTerm = new Array(0);
    let modifiedRemove = new Array(0);

    for (let i = 0; i < leftSide.length; i += term.length) {
        term = getTerm(i, leftSide);
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

    for (let i = 0; i < rightSide.length; i += term.length) {
        term = getTerm(i, rightSide);
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

    leftSide = copyArray(leftFinal);
    rightSide = copyArray(rightFinal);
}

function removeSpaces(formula) {
    let result = formula.replaceAll(" ", "");
    return result;
}

function divideFormula(formula) {
    let indexOfEqual = formula.indexOf("=");
    leftSide = formula.substring(0, indexOfEqual);
    rightSide = formula.substring(indexOfEqual + 1);
}

function createArray(expression) {
    let modifiedExpression = "";

    for (let i = 0; i < expression.length; i++) {
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

        if (isVariable) {
            variables.push(array[i]);
        }
    }
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

    for (let i = start; i <= array.length; i++) {
        if (i == array.length) end = i;
        if (array[i] == "(") brackets++;
        if (isOperator(array[i])) {
            if (brackets == 0) {
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

    let expression = new Array(end - start);
    let expressionIndex = 0;
    for (let i = start; i < end; i++) {
        expression[expressionIndex] = array[i];
        expressionIndex++;
    }

    return expression;
}

function getDenominator(array) {
    let brackets = 0;
    let end = -1;
    let start = 0;
    let maxBracket = 1000;

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "(") brackets++;
        else if (array[i] == ")") brackets--;

        if (array[i] == "/" && brackets <= maxBracket) {
            start = i + 1;
            maxBracket = brackets;
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

    for (let i = 0; i < array.length; i++) {
        if (array[i] == "(") brackets++;
        else if (array[i] == ")") brackets--;

        if (array[i] == "/" && brackets <= maxBracket) {
            start = i;
            maxBracket = brackets;
        }
    }
    return start;
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

function copyArray(array) {
    let result = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
        result[i] = array[i];
    }

    return result;
}

module.exports.execute = execute;