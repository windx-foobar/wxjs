export const plainObject = {};
plainObject.toString = () => JSON.stringify(plainObject);

export const plainObjectFill = { foo: 'bar', baz: 'foo' };
plainObjectFill.toString = () => JSON.stringify(plainObjectFill);
