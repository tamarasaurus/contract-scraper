import * as assert from 'assert';
import text from '../../../src/attribute/text';

describe('creates a size attribute', () => {
  it('extracts a trimmed text from a string', () => {
    assert.equal(
      text(' Some text with some spaces '),
      'Some text with some spaces',
    );
  });

  it('returns null for an empty string', () => {
    assert.equal(text(''), null);
  });
});
