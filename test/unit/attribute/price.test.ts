import * as assert from 'assert';
import Digit from '../../../src/attribute/digit';

describe('creates a digit attribute', () => {
  it('returns the number from a digit string', () => {
    assert.equal(new Digit('345 000 €').value, 345000);
    assert.equal(new Digit('TAXE FONCIÈRE 423 €.').value, 423);
  });

  it('returns zero for an empty digit', () => {
    assert.equal(new Digit('There is no size in this string').value, null);
  });

  it('returns null if the digit is not valid', () => {
    assert.equal(new Digit(null).value, null);
    assert.equal(new Digit(undefined).value, null);
    assert.equal(new Digit('A string with no digit').value, null);
    assert.equal(new Digit(' ').value, null);
  });
});
