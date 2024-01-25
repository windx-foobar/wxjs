import { describe, it, expect } from 'vitest';
import { EmptyClass, FilledClass, plainObjectFill, plainObject, emptyArray, filledArray } from './mocks';
import * as shared from '../src';

const variants = [
  EmptyClass,
  FilledClass,
  plainObject,
  plainObjectFill,
  emptyArray,
  filledArray,
  'foo',
  1,
  false,
  true,
  undefined,
  // Symbol('xxx')
];

describe('isUndefined', () => {
  variants.forEach((_val) => {
    it(`check ${_val}`, () => {
      expect(shared.isUndefined(_val)).toBe(typeof _val === 'undefined');
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isUndefined()).toBe(true);
  });
});

describe('isString', () => {
  variants.forEach((_val) => {
    it(`check ${_val}`, () => {
      expect(shared.isString(_val)).toBe(typeof _val === 'string');
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isString()).toBe(false);
  });
});

describe('isArray', () => {
  variants.forEach((_val) => {
    it(`check ${_val}`, () => {
      expect(shared.isArray(_val)).toBe(Array.isArray(_val));
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isArray()).toBe(false);
  });
});
