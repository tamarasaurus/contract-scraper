import link from '../../../src/attribute/link';
import { expect, describe, it } from 'vitest'

describe('creates a link attribute', () => {
  it('extracts a full url from a string', () => {
    const fullUrl = `http://whatever.com/whatever `;
    expect(link(fullUrl, 'http://whatever.com')).toEqual(
      'http://whatever.com/whatever',
    );
  });

  it('extracts a relative url from a string', () => {
    const relativeUrl = `/whatever/another`;
    expect(link(relativeUrl, 'http://whatever.com/')).toEqual(
      'http://whatever.com/whatever/another',
    );
  });

  it('returns null if the link is empty', () => {
    expect(link('', 'whatever')).toEqual(null);
  });
});
