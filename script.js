// sample formulas
let formula1 = "a = 1 + 2";
let formula2 = "a = b + c";
let formula3 = "";

let leftSide = "";
let rightSide = "";

divideFormula(removeSpaces(formula1));
console.log(leftSide);
console.log(rightSide);

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
    
}