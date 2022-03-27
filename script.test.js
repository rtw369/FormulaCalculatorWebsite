const script = require('./script');

test('test formulae', () => {
    let formula1 = "2+6/3-4 = x";
    let formula2 = "((1+2)((3-4)(5+6))(7-8)) = x";
    let formula3 = "((1+2)+((3-4)(5+6))-(7-8)) = x";

    expect(script.execute(formula1)).toBe(0);
    expect(script.execute(formula2)).toBe(33);
    expect(script.execute(formula3)).toBe(-7);
});

test('test quadratic functions', () => {
    let quadratic1 = "x^2+2*x+1=0";
    let quadratic2 = "(x+1)(x-1) = 0";
    let quadratic3 = "(x+11)(x+4) = 0";

    expect(script.execute(quadratic1)).toBe("-1\nor\n-1");
    expect(script.execute(quadratic2)).toBe("1\nor\n-1");
    expect(script.execute(quadratic3)).toBe("-4\nor\n-11");
});

test('test more complicated equations', () => {
    formula1 = "x*2+2=3";
    formula2 = "(4-(x/3)) = 2";
    formula3 = "x+x+3 = x-7";

    expect(script.execute(formula1)).toBe(0.5);
    expect(script.execute(formula2)).toBe(6);
    expect(script.execute(formula3)).toBe(-10);
});

test('test trignometry functions', () => {
    let sine = "x = sin90";
    let cosine = "x = cos90";
    let tangent = "x = tan45";
    let asine = "x = asin0.5";
    let acosine = "x = acos0.5";
    let atangent = "x = atan1";

    expect(script.execute(sine)).toBe(1);
    expect(script.execute(cosine)).toBe(0);
    expect(Math.round(script.execute(tangent))).toBe(1);
    expect(Math.round(script.execute(asine))).toBe(30);
    expect(Math.round(script.execute(acosine))).toBe(60);
    expect(Math.round(script.execute(atangent))).toBe(45);
});

test('a little more complicated trignometry functions', () => {
    let function1 = "sin90 = x + 3";
    let function2 = "x*sin90 = 1";
    let function3 = "30*sinx = 30";
    let function4 = "30*sin(x+3) = 30";

    expect(script.execute(function1)).toBe(-2);
    expect(script.execute(function2)).toBe(1);
    expect(script.execute(function3)).toBe(90);
    expect(script.execute(function4)).toBe(87);
});