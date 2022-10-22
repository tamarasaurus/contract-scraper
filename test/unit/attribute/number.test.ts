import number from '../../../src/attribute/number';

describe('creates a number attribute', () => {
  it('returns the number from a number string', () => {
    expect(number('345 000 €')).toEqual(345000);
    expect(number('TAXE FONCIÈRE 423 €.')).toEqual(423);
  });

  it('returns zero for an empty number', () => {
    expect(number('There is no size in this string')).toEqual(null);
  });

  it('returns null if the number is not valid', () => {
    expect(number('')).toEqual(null);
    expect(number('A string with no number')).toEqual(null);
    expect(number(' ')).toEqual(null);
  });
});
