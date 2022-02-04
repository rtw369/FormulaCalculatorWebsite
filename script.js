// sample formulas
let formula1 = "a = 1/(3+2+1)^2*3";
let formula2 = "a = b + c";
let formula3 = "a+ b-c*d / e = (sinf+cosg)*Pi";

let leftSide = "";
let rightSide = "";
let variables = new Array();
let values = new Array();

initialize(formula1);

function initialize(formula) {
    divideFormula(removeSpaces(formula));
    leftSide = turnIntoArray(leftSide);
    rightSide = turnIntoArray(rightSide);

    setVariables(leftSide);
    setVariables(rightSide);

    /*
    let termEndIndex = findTerm(0, rightSide);

    let term = new Array(termEndIndex + 1);

    for(let i = 0; i < termEndIndex; i++) {
        term[i] = rightSide[i];
    }

    for(let i = 0; i < term.length; i++) {
        console.log(term[i]);
    }
    */

    let denominator = getDenominator(rightSide);

    for(let i = 0; i < denominator.length; i++) {
        console.log(denominator[i]);
    }

    

    // get user input and set values
    // find which variable to solve for - a variable that has undefined as its value
    // rearrange
    //      - findTerm
    //      - moveTerm
    //      - getDenominator
    //      - removeDenominator
    //      - expand
    // calculate
    // return final value
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
function turnIntoArray(expression) {
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

function findTerm(start, array) {
    let brackets = 0;

    for(let i = start; i < array.length; i++) {
        if(array[i] == "(") brackets++;
        else if (array[i] == ")") brackets--;
        
        if((array[i] == "-" || array[i] == "+") && brackets == 0) return i;
    }

    return array.length;
}

function getDenominator(array) {
    let start = array.indexOf("/") + 1;
    let brackets = 0;
    let end = -1;

    for(let i = start; i <= array.length && i > -1; i++) {
        
        if(i == array.length) {
            end = i;
            brackets = -1;
        }
        else if(array[i] == "(") brackets++;
        else if (array[i] == ")") brackets--;

        if(brackets == 0 && (array[i] == "+" || array[i] == "-" || array[i] == "*" || array[i] == "/")) end = i;
    }

    let denominator = new Array(end - start);
    let indexOfDenominator = 0;

    for(let i = start; i < denominator.length; i++) {
        denominator[indexOfDenominator] = array[i];
        indexOfDenominator++;
    }

    return denominator;
}