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