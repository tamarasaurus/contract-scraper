import * as assert from 'assert';
import number from '../../../src/attribute/number';

describe('creates a number attribute', () => {
  it('returns the number from a number string', () => {
    assert.equal(number('345 000 €'), 345000);
    assert.equal(number('TAXE FONCIÈRE 423 €.'), 423);
  });

  it('returns zero for an empty number', () => {
    assert.equal(number('There is no size in this string'), null);
  });

  it('returns null if the number is not valid', () => {
    assert.equal(number(null), null);
    assert.equal(number(undefined), null);
    assert.equal(number('A string with no number'), null);
    assert.equal(number(' '), null);
  });
});
