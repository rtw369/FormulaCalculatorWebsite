const script = require('./script');

test('test formula: 2 + 6 / 3 - 4 = x', () => {
    expect(script.execute("2 + 6 / 3 - 4 = x")).toBe(0);
});