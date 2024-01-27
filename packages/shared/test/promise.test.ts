import { describe, expect, it } from 'vitest';
import { MOCK_VALUES } from './mocks';

import * as shared from '../src';

describe('isPromise', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isPromise(mock.value)).toBe(mock._promise);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isPromise()).toBe(false);
  });
});

describe('isPromiseLike', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isPromiseLike(mock.value)).toBe(mock._promiseLike);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isPromiseLike()).toBe(false);
  });
});

describe('isThenable', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isThenable(mock.value)).toBe(mock._thenable);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isThenable()).toBe(false);
  });
});
