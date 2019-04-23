import * as assert from 'assert';
import Text from '../../../src/attribute/text';

describe('creates a size attribute', () => {
    it('extracts a trimmed text from a string', () => {
        assert.equal(new Text(' Some text with some spaces ').value, 'Some text with some spaces');
    });

    it('returns null for an empty string', () => {
        assert.equal(new Text('').value, null);
    });
});
