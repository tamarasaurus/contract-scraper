import * as assert from 'assert';
import Price from '../../../src/attribute/price';

describe('creates a price attribute', () => {
  it('returns the number from a price string', () => {
    assert.equal(new Price('345 000 €').value, 345000);
    assert.equal(new Price('TAXE FONCIÈRE 423 €.').value, 423);
  });

  it('returns zero for an empty price', () => {
    assert.equal(new Price('There is no size in this string').value, null);
  });

  it('returns null if the price is not valid', () => {
    assert.equal(new Price(null).value, null);
    assert.equal(new Price(undefined).value, null);
    assert.equal(new Price('A string with no price').value, null);
    assert.equal(new Price(' ').value, null);
  });
});
