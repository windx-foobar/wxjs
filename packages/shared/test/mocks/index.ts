import { EmptyClass, FilledClass } from './class';
import { emptyArray, mixedArray, stringArray, plainObjectArray } from './array';
import { emptyPromise, resultPromise, emptyPromiseLike, resultPromiseLike, emptyThenable, resultThenable } from './promise';

interface MockValue {
  value: any;
  view: string;

  _plainObject: boolean;
  _class: boolean;

  _array: boolean;
  _arrayString: boolean;
  _arrayPlainObject: boolean;

  _boolean: boolean;
  _truthy: boolean;
  _falsy: boolean;

  _undefined: boolean;
  _null: boolean;

  _string: boolean;
  _numeric: boolean;

  _number: boolean;

  _promise: boolean;
  _promiseLike: boolean;
  _thenable: boolean;
}

const defaultsSchema = (defaults: Partial<MockValue> & Pick<MockValue, 'value'>) => ({
  _plainObject: false,
  _array: false,
  _string: false,
  _number: false,
  _arrayString: false,
  _arrayPlainObject: false,
  _boolean: false,
  _undefined: false,
  _falsy: false,
  _truthy: false,
  _numeric: false,
  _null: false,
  _promise: false,
  _promiseLike: false,
  _thenable: false,
  view: defaults.value,
  ...defaults
} as MockValue);

export const MOCK_VALUES: MockValue[] = [
  defaultsSchema({ value: new EmptyClass(), view: 'EmptyClass {}', _truthy: true, _class: true }),
  defaultsSchema({
    value: new FilledClass(),
    view: `FilledClass { foo = 'bar', bar = 'baz' }`,
    _truthy: true,
    _class: true
  }),
  defaultsSchema({ value: {}, view: '{}', _plainObject: true, _truthy: true }),
  defaultsSchema({
    value: { foo: 'bar', bar: 'baz' },
    view: JSON.stringify({ foo: 'bar', bar: 'baz' }),
    _plainObject: true,
    _truthy: true
  }),
  defaultsSchema({ value: emptyArray, view: JSON.stringify(emptyArray), _array: true, _truthy: true }),
  defaultsSchema({ value: mixedArray, view: JSON.stringify(mixedArray), _array: true, _truthy: true }),
  defaultsSchema({
    value: stringArray,
    view: JSON.stringify(stringArray),
    _array: true,
    _arrayString: true,
    _truthy: true
  }),
  defaultsSchema({
    value: plainObjectArray,
    view: JSON.stringify(plainObjectArray),
    _array: true,
    _arrayPlainObject: true,
    _truthy: true
  }),
  defaultsSchema({ value: '', view: `''`, _string: true, _falsy: true }),
  defaultsSchema({ value: 'foo', view: `'foo'`, _string: true, _truthy: true }),
  defaultsSchema({ value: '1', view: `'1'`, _string: true, _truthy: true, _numeric: true }),
  defaultsSchema({ value: 1, _number: true, _truthy: true }),
  defaultsSchema({ value: 0, _number: true, _falsy: true }),
  defaultsSchema({ value: false, _boolean: true, _falsy: true }),
  defaultsSchema({ value: true, _boolean: true, _truthy: true }),
  defaultsSchema({ value: undefined, _undefined: true, _falsy: true }),
  defaultsSchema({ value: null, _falsy: true, _null: true }),
  defaultsSchema({ value: emptyPromise, _promise: true, _promiseLike: true, _thenable: true }),
  defaultsSchema({ value: resultPromise, _promise: true, _promiseLike: true, _thenable: true }),
  defaultsSchema({ value: emptyPromiseLike, _promiseLike: true, _thenable: true }),
  defaultsSchema({ value: resultPromiseLike, _promiseLike: true, _thenable: true }),
  defaultsSchema({ value: emptyThenable, _thenable: true }),
  defaultsSchema({ value: resultThenable, _thenable: true })
];

export * from './class';
export * from './array';
export * from './promise';
