import * as assert from 'assert';
import Link from '../../../src/attribute/link';

describe('creates a link attribute', () => {
    it('extracts a full url from a string', () => {
        const fullUrl = `http://whatever.com/whatever `;
        assert.equal(new Link(fullUrl, 'http://whatever.com').getValue(), 'http://whatever.com/whatever');
    });

    it('extracts a relative url from a string', () => {
        const relativeUrl = `/whatever/another`;
        assert.equal(new Link(relativeUrl, 'http://whatever.com/').getValue(), 'http://whatever.com/whatever/another');
    });

    it('returns null if the link is empty', () => {
        assert.equal(new Link('', 'whatever').getValue(), null);
    });
});
