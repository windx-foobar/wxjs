import { EmptyClass, FilledClass } from './class';
import { plainObject, plainObjectFill } from './plainObject';
import { emptyArray, mixedArray, stringArray, plainObjectArray } from './array';

export * from './plainObject';
export * from './class';
export * from './array';

interface MockValue {
  value: any;
  view: string;

  _plainObject: boolean;

  _array: boolean;
  _arrayString: boolean;
  _arrayPlainObject: boolean;

  _boolean: boolean;
  _truthy: boolean;
  _falsy: boolean;

  _undefined: boolean;

  _string: boolean;
  _numeric: boolean;

  _number: boolean;
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
  view: defaults.value,
  ...defaults
} as MockValue);

export const MOCK_VALUES: MockValue[] = [
  defaultsSchema({ value: EmptyClass, _truthy: true }),
  defaultsSchema({ value: FilledClass, _truthy: true }),
  defaultsSchema({ value: plainObject, _plainObject: true, _truthy: true }),
  defaultsSchema({ value: plainObjectFill, _plainObject: true, _truthy: true }),
  defaultsSchema({ value: emptyArray, _array: true, _truthy: true }),
  defaultsSchema({ value: mixedArray, _array: true, _truthy: true }),
  defaultsSchema({ value: stringArray, _array: true, _arrayString: true, _truthy: true }),
  defaultsSchema({ value: plainObjectArray, _array: true, _arrayPlainObject: true, _truthy: true }),
  defaultsSchema({ value: '', view: `''`, _string: true, _falsy: true }),
  defaultsSchema({ value: 'foo', view: `'foo'`, _string: true, _truthy: true }),
  defaultsSchema({ value: '1', view: `'1'`, _string: true, _truthy: true, _numeric: true }),
  defaultsSchema({ value: 1, _number: true, _truthy: true }),
  defaultsSchema({ value: 0, _number: true, _falsy: true }),
  defaultsSchema({ value: false, _boolean: true, _falsy: true }),
  defaultsSchema({ value: true, _boolean: true, _truthy: true }),
  defaultsSchema({ value: undefined, _undefined: true, _falsy: true }),
  defaultsSchema({ value: null, _falsy: true }),
];
