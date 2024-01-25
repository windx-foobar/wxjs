export const emptyArray = [];
emptyArray.toString = () => JSON.stringify(emptyArray);

export const filledArray = [{ foo: 'bar' }, 1, 6];
filledArray.toString = () => JSON.stringify(filledArray);
