const script = require('./script');

const test1 = ("(","3","+","2",")");
const test2 = ("(","1","+","2",")","+","(","3",")");

test('getFrontExpression', () => {
    //expect(script.getFrontExpression(4, test1)).equals("(","3","+","2",")");
    expect(script.getFrontExpression(5, test2)).toBe("(","1","+","2",")");
});