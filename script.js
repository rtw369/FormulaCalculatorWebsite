// sample formulas
let formula1 = "((2+3)((4(6))(5))(5+3)) = 2+(4+3)";
let formula2 = "(3)/(4)(5) = (9)^3";
let formula3 = "a+ b-c*d / e = (sinf+cosg)*Pi";

let leftSide = "";
let rightSide = "";
let variables = new Array();
let values = new Array();

initialize(formula1);

function initialize(formula) {
    divideFormula(removeSpaces(formula));
    leftSide = createArray(leftSide);
    rightSide = createArray(rightSide);

    setVariables(leftSide);
    setVariables(rightSide);
/*
    let term = getTerm(0, leftSide);    
    console.log("term : \n")
    for(let i = 0; i < term.length; i++) {
        console.log(term[i]);
    }
    let denominator = getDenominator(rightSide);
    console.log("denominator : \n")
    for(let i = 0; i < denominator.length; i++) {
        console.log(denominator[i]);
    }
    let expression = getExpression(rightSide.length - 1, rightSide);
    for(let i = 0; i < expression.length; i++) {
        console.log(expression[i]);
    }
    let expression = new Array(0);
    for(let i = rightSide.length - 1; i >=0; i -= expression.length) {
        expression = getExpression(i, rightSide);
        console.log("expression: \n");
        for(let n = 0; n < expression.length; n++) {
            console.log(expression[n]);
        }
    }*/
/*
    leftSide = expandPower(leftSide);  
    rightSide = expandPower(rightSide);

    while(leftSide.indexOf("/") != -1 || rightSide.indexOf("/") != -1) {
        removeDenominator();
    }
*/
    expand(leftSide);

    //console.log(leftSide);
    //console.log(rightSide);

    //console.log(getFrontExpression(5,"(5)*(4)"))

    // get user input and set values
    // find which variable to solve for - a variable that has undefined as its value
    // rearrange
    //      - getTerm (completed)
    //      - moveTerm
    //      - getDenominator (completed)
    //      - removeDenominator (completed)
    //      - expand - do the inner brackets first
    // calculate
    // return final value
}

function expandPower(array) {
    let frontExpression = new Array(0);
    let backExpression = new Array(0);
    let frontArray = new Array(0);
    let backArray = new Array(0);
    let finalArray = copyArray(array);
    let powerIndex = finalArray.indexOf("^");

    while(powerIndex != -1) {
        frontExpression = getFrontExpression(powerIndex - 1, finalArray);
        backExpression = getBackExpression(powerIndex + 1, finalArray);

        if(parseInt(backExpression[0]) == 0) {
            frontArray = finalArray.splice(0, powerIndex - frontExpression.length);
            backArray = finalArray.splice(powerIndex + backExpression.length + 1);
            frontArray.push("(");
            frontArray.push("1");
            frontArray.push(")");
            finalArray = frontArray.concat(backArray);
            powerIndex = finalArray.indexOf("^");
        }
        else {
            frontArray = finalArray.splice(0, powerIndex - frontExpression.length);
            backArray = finalArray.splice(powerIndex + backExpression.length + 1);
            frontArray.push("(");
            frontArray = frontArray.concat(frontExpression);

            // get the value of backExpression and repeat for that amount
            for(let i = 1; i < parseInt(backExpression[0]); i++) {
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

    //find the second most inner bracket
    for(let i = 0; i < array.length; i++) {
        if(array[i] == "(") {
            bracket++;
            if(bracket > numOfBrackets) {
                numOfBrackets = bracket;
                secondBracket = lastBracketIndex;
            }
            if(bracket >= numOfBrackets) lastBracketIndex = i;
        }
        if(array[i] == ")") bracket--;
    }

    //get the every expressions within the brackets
    bracket = 1;
    let end = -1;
    for(let i = secondBracket + 1; i <= array.length; i++) {
        if(i == array.length) end = i + 1;
        if(array[i] == "(") bracket++;
        if(array[i] == ")") {
            bracket--;
            if(bracket == 0) {
                end = i + 1;
                i = array.length +1;
            }
        }
    }

    let expression = new Array(0);
    for(let i = secondBracket + 1 ; i < end - 1; i++) {
        expression.push(array[i]);
    }

    console.log(expression);
}

function removeDenominator() {
    let term = new Array(0);
    let remove = new Array(0);
    let denominator = new Array(0);
    let expression = new Array(0);
    let leftFinal = new Array(0);
    let rightFinal = new Array(0);

    for(let i = 0; i < leftSide.length; i += term.length) {
        term = getTerm(i, leftSide);
        denominator = getDenominator(term);
        if(denominator != "") {
            remove.push("*");
            remove = remove.concat(denominator);
        }
    }

    for(let i = 0; i < rightSide.length; i += term.length) {
        term = getTerm(i, rightSide);
        denominator = getDenominator(term);
        if(denominator != "") {
            remove.push("*");
            remove = remove.concat(denominator);
        }
    }

    let modifiedTerm = new Array(0);
    let modifiedRemove = new Array(0);

    for(let i = 0; i < leftSide.length; i += term.length) {
        term = getTerm(i, leftSide);
        modifiedTerm = copyArray(term);
        modifiedRemove = copyArray(remove);
        denominator = getDenominator(term);
        for(let n = remove.length - 1; n >= 0; n -= expression.length) {
            expression = getFrontExpression(n, remove);
            if(compareArray(denominator, expression)) {
                modifiedTerm.splice(getDenominatorIndex(term), denominator.length + 1);
                modifiedRemove.splice(n - expression.length, expression.length + 1);
                leftFinal = leftFinal.concat(modifiedTerm.concat(modifiedRemove));
                n = -1;
            }
            else if(n == 0 && !compareArray(denominator, expression)) {
                leftFinal = leftFinal.concat(term.concat(remove));
            }
        }
    }

    for(let i = 0; i < rightSide.length; i += term.length) {
        term = getTerm(i, rightSide);
        modifiedTerm = copyArray(term);
        modifiedRemove = copyArray(remove);
        denominator = getDenominator(term);
        for(let n = remove.length - 1; n >= 0; n -= expression.length) {
            expression = getFrontExpression(n, remove);
            if(compareArray(denominator, expression)) {
                modifiedTerm.splice(getDenominatorIndex(term), denominator.length + 1);
                modifiedRemove.splice(n - expression.length, expression.length + 1);
                rightFinal = rightFinal.concat(modifiedTerm.concat(modifiedRemove));
                n = -1;
            }
            else if(n == 0 && !compareArray(denominator, expression)) {
                rightFinal = rightFinal.concat(term.concat(remove));
            }
        }
    }

    leftSide = copyArray(leftFinal);
    rightSide = copyArray(rightFinal);
}

//when the program recieves the formula, take out the empty characters within a formula
function removeSpaces(formula) {
    let result = formula.replaceAll(" ", "");
    return result;
}

//then divide the formula into two strings at = sign
function divideFormula(formula) {
    let indexOfEqual =  formula.indexOf("=");
    leftSide = formula.substring(0, indexOfEqual);
    rightSide = formula.substring(indexOfEqual+1);
}

//add spaces in certain places and split by that spaces to create an array
function createArray(expression) {
    let modifiedExpression = "";

    for(let i = 0; i < expression.length; i++)
    {
        switch(expression.substr(i,3)) {
            case "sin":
            case "cos":
            case "tan":
                modifiedExpression += " "+expression.substr(i,3)+" ";
                i += 3;
            break;

            default:
        }

        switch(expression.substr(i,2)) {
            case "Pi":
                modifiedExpression += " "+expression.substr(i,2)+" ";
                i += 2;
            break;

            default:
        }

        switch(expression.substr(i,1)) {
            case "+":
            case "-":
            case "*":
            case "/":
            case "^":
            case "(":
            case ")":
            case "E":
                modifiedExpression += " "+expression.substr(i,1)+" ";
            break;
            
            default:
                modifiedExpression += expression.substr(i,1);
                break;
        }
    }

    let finalArray = modifiedExpression.split(" ");

    // delete any empty string in the array
    for(let i = 0; i < finalArray.length; i++)
    {
        if(finalArray[i] === "") {
            finalArray.splice(i,1);
        }
    }

    return finalArray;
}

function setVariables(array) {
    let isVariable = false;
    let exceptions = "1234567890+-=/*^()E";

    for(let i = 0; i < array.length; i++) {
        isVariable = true;

        for(let n = 0; n < exceptions.length; n++) {
            if(array[i].charAt(0) == exceptions.charAt(n)) {
                isVariable = false;
            }
        }
        for(let n = 0; n < variables.length; n++) {
            if(array[i] == variables[n]) {
                isVariable = false;
            }
        }

        if(array[i].length == 2 && array[i] == "Pi") isVariable = false;
        else if(array[i].length == 3) {
            if(array[i] == "sin") isVariable = false;
            else if(array[i] == "cos") isVariable = false;
            else if(array[i] == "tan") isVariable = false;
        }

        if(isVariable) {
            variables.push(array[i]);
        }
    }
}

function getTerm(start, array) {
    let brackets = 0;
    let end = -1;

    // +(2/4)/(3+2)/5+2/4+3/6

    for(let i = start; i <= array.length; i++) {
        if(i == array.length && end == -1) end = i;
        
        if(array[i] == "(") brackets++;
        else if (array[i] == ")") brackets--;
        
        
        if(i != start && (array[i] == "-" || array[i] == "+") && brackets == 0) {
            end = i;
            i = array.length;
        }
    }

    let term = new Array(end - start);
    let termIndex = 0;

    for(let i = start; i < end; i++) {
        term[termIndex] = array[i];
        termIndex++;
    }

    return term;
}

// start from back and progress towards front
function getFrontExpression(end, array) {
    let brackets = 0;
    let start = -1;

    for(let i = end; i >= 0; i--) {
        if(i == 0 && start == -1) start = i;

        if(array[i] == ")") brackets++;

        if(brackets == 0 && isOperator(array[i]) && i ==  end) return array[i];
        else if(isOperator(array[i]) && brackets == 0) {
            start = i + 1;
            i = -1;
        }
        /*
        else if(brackets == 1 && array[i] == "(") {
            start = i;
            i = -1;
        }*/

        if(array[i] == "(") brackets--;
    }

    let expression = new Array(end - start);
    let expressionIndex = 0;

    for(let i = start; i <= end; i++) {
        expression[expressionIndex] = array[i];
        expressionIndex++;
    }

    return expression;
}

function getBackExpression(start, array) {
    let brackets = 0;
    let end = -1;

    for(let i = start; i <= array.length; i++) {
        if(i == array.length) end = i;
        if(array[i] == "(") brackets++;
        if(isOperator(array[i])){
            if(brackets == 0) {
                end = i;
                i = array.length + 1;
            }
            else if(brackets == 1 && array[i] == ")") {
                end = i+1;
                i = array.length + 1;
            }
        }
        if(array[i] == ")") brackets--;
    }

    let expression = new Array(end - start);
    let expressionIndex = 0;
    for(let i = start; i < end; i++) {
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

    for(let i = 0; i < array.length; i++) {
        if(array[i] == "(") brackets++;
        else if(array[i] == ")") brackets--;

        if(array[i] == "/" && brackets <= maxBracket) {
            start = i+1;
            maxBracket = brackets;
        }
    }

    let denominator = ("");

    if(start == 0) return denominator;

    brackets = 0;
    for(let i = start; i <= array.length && i >= 0; i++) {
        
        if(i == array.length && end == -1) {
            end = i;
        }

        if(array[i] == "(") brackets++;
        else if(brackets == 0 && isOperator(array[i])) {
            end = i;
            i = array.length;
        }
        else if (array[i] == ")") brackets--;
    }

    denominator = new Array(end - start);
    let index = 0;

    for(let i = start; i < end; i++) {
        denominator[index] = array[i];
        index++;
    }

    return denominator;
}

function getDenominatorIndex(array) {
    let brackets = 0;
    let start = -1;
    let maxBracket = 1000;

    for(let i = 0; i < array.length; i++) {
        if(array[i] == "(") brackets++;
        else if(array[i] == ")") brackets--;

        if(array[i] == "/" && brackets <= maxBracket) {
            start = i;
            maxBracket = brackets;
        }
    }
    return start;
}

function isOperator(string) {
    if(string === "+") return true;
    else if(string === "-") return true;
    else if(string === "*") return true;
    else if(string === "/") return true;
    else if(string === "(") return true;
    else if(string === ")") return true;
    else return false;
}

function isVariable(string) {
    for(let i = 0; i < variables.length; i++) {
        if(string == variables[i]) return true;
    }
    return false;
}

function compareArray(array1, array2) {
    if(array1.length !=  array2.length) return false;
    for(let i = 0; i < array1.length; i++) {
        if(array1[i] != array2[i]) return false;
    }
    return true;
}

function copyArray(array) {
    let result = new Array(array.length);
    for(let i = 0; i < array.length; i++) {
        result[i] = array[i];
    }

    return result;
}