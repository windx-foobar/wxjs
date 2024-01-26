import { describe, expect, it } from 'vitest';
import { MOCK_VALUES } from './mocks';

import * as shared from '../src';

describe('isArray', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isArray(mock.value)).toBe(mock._array);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isArray()).toBe(false);
  });
});

describe('isArrayString', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isArrayString(mock.value)).toBe(mock._array && mock._arrayString);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isArrayString()).toBe(false);
  });
});

describe('isArrayPlainObject', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isArrayPlainObject(mock.value)).toBe(mock._array && mock._arrayPlainObject);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isArrayPlainObject()).toBe(false);
  });
});
