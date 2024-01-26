import { describe, expect, it } from 'vitest';
import { MOCK_VALUES } from './mocks';

import * as shared from '../src';

describe('isNumber', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isNumber(mock.value)).toBe(mock._number);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isNumber()).toBe(false);
  });
});

describe('isNumeric', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isNumeric(mock.value)).toBe(mock._number || mock._numeric);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isNumeric()).toBe(false);
  });
});
