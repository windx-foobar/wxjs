import { describe, expect, it } from 'vitest';
import { MOCK_VALUES } from './mocks';

import * as shared from '../src';

describe('isString', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isString(mock.value)).toBe(mock._string);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isString()).toBe(false);
  });
});
