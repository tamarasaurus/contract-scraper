import text from '../../../src/attribute/text';

describe('creates a size attribute', () => {
  it('extracts a trimmed text from a string', () => {
    expect(text(' Some text with some spaces ')).toEqual(
      'Some text with some spaces',
    );
  });

  it('returns null for an empty string', () => {
    expect(text('')).toEqual(null);
  });
});
