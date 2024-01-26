import { plainObject, plainObjectFill } from './plainObject';

export const emptyArray = [];
emptyArray.toString = () => JSON.stringify(emptyArray);

export const mixedArray = [{ foo: 'bar' }, 1, '6', false];
mixedArray.toString = () => JSON.stringify(mixedArray);

export const stringArray = ['foo', 'bar', 'baz'];
stringArray.toString = () => JSON.stringify(stringArray);

export const plainObjectArray = [plainObject, plainObjectFill];
plainObjectArray.toString = () => JSON.stringify(plainObjectArray);
