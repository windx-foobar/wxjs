import { describe, expect, it } from 'vitest';
import { MOCK_VALUES } from './mocks';

import * as shared from '../src';

describe('isBoolean', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isBoolean(mock.value)).toBe(mock._boolean);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isBoolean()).toBe(false);
  });
});

describe('isTruthy', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isTruthy(mock.value)).toBe(mock._truthy);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isTruthy()).toBe(false);
  });
});

describe('isFalsy', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isFalsy(mock.value)).toBe(mock._falsy);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isFalsy()).toBe(true);
  });
});
