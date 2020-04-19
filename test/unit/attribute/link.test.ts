import * as assert from 'assert';
import link from '../../../src/attribute/link';

describe('creates a link attribute', () => {
  it('extracts a full url from a string', () => {
    const fullUrl = `http://whatever.com/whatever `;
    assert.equal(
      link(fullUrl, 'http://whatever.com'),
      'http://whatever.com/whatever',
    );
  });

  it('extracts a relative url from a string', () => {
    const relativeUrl = `/whatever/another`;
    assert.equal(
      link(relativeUrl, 'http://whatever.com/'),
      'http://whatever.com/whatever/another',
    );
  });

  it('returns null if the link is empty', () => {
    assert.equal(link('', 'whatever'), null);
  });
});
