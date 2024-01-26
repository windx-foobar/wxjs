import { describe, expect, it } from 'vitest';
import { MOCK_VALUES } from './mocks';

import * as shared from '../src';

describe('isObject', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isObject(mock.value)).toBe(mock._plainObject || mock._class || false);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isObject()).toBe(false);
  });
});

describe('isPlainObject', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isPlainObject(mock.value)).toBe(mock._plainObject);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isPlainObject()).toBe(false);
  });
});

describe('isNull', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isNull(mock.value)).toBe(mock._null);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isNull()).toBe(false);
  });
});

describe('isUndefined', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isUndefined(mock.value)).toBe(mock._undefined);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isUndefined()).toBe(true);
  });
});

describe('isNullOrUndefined', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      expect(shared.isNullOrUndefined(mock.value)).toBe(mock._undefined || mock._null);
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(shared.isNullOrUndefined()).toBe(true);
  });
});

describe('pick', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      if (!mock._plainObject && !mock._class) {
        const result = expect(() => shared.pick(mock.value, ['foo']));

        result.toThrowError(/^Passed not plain object$/);
      } else {
        const result = expect(shared.pick(mock.value, ['foo']));

        if (Object.keys(mock.value).length) {
          result.toMatchObject({ foo: 'bar' });
        } else {
          result.toMatchObject({});
        }
      }
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(() => shared.pick()).toThrowError(/^Passed not plain object$/);
  });
});

describe('tryPick', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      const result = expect(shared.tryPick(mock.value, ['foo']));

      if (!mock._plainObject && !mock._class) {
        result.toMatchObject({});
      } else {
        if (Object.keys(mock.value).length) {
          result.toMatchObject({ foo: 'bar' });
        } else {
          result.toMatchObject({});
        }
      }
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(() => shared.tryPick()).toMatchObject({});
  });
});

describe('omit', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      if (!mock._plainObject && !mock._class) {
        const result = expect(() => shared.omit(mock.value, ['foo']));

        result.toThrowError(/^Passed not plain object$/);
      } else {
        const result = expect(shared.omit(mock.value, ['foo']));

        if (Object.keys(mock.value).length) {
          result.toMatchObject({ bar: 'baz' });
        } else {
          result.toMatchObject({});
        }
      }
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(() => shared.omit()).toThrowError(/^Passed not plain object$/);
  });
});

describe('tryOmit', () => {
  MOCK_VALUES.forEach((mock) => {
    it(`check ${mock.view}`, () => {
      const result = expect(shared.tryOmit(mock.value, ['foo']));

      if (!mock._plainObject && !mock._class) {
        result.toMatchObject({});
      } else {
        if (Object.keys(mock.value).length) {
          result.toMatchObject({ bar: 'baz' });
        } else {
          result.toMatchObject({});
        }
      }
    });
  });

  it('check not passed', () => {
    // @ts-ignore
    expect(() => shared.tryOmit()).toMatchObject({});
  });
});
