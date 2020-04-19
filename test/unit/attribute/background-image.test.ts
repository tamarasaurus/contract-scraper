import * as assert from 'assert';
import backgroundImage from '../../../src/attribute/background-image';

const rootUrl = 'http://website.com/';
const rootUrlWithPath = 'http://website.com/whatever/more/stuff';
const imageUrl = 'http://website.com/images/whatever.jpeg';
describe('creates a background image attribute', () => {
  it('extracts a full url from a style tag', () => {
    const fullUrl = `color:red;background-image:url('${imageUrl}')`;
    const image = backgroundImage(fullUrl, rootUrl);

    assert.equal(image, imageUrl);
  });

  it('extracts a relative url from a style tag', () => {
    const relativeUrl = `color:red;background-image:url('../images/whatever.jpeg')`;
    const image = backgroundImage(relativeUrl, rootUrl);
    assert.equal(image, imageUrl);
  });

  it('extracts a relative url from a style tag and returns the root', () => {
    const relativeUrl = `color:red;background-image:url('/images/whatever.jpeg')`;
    const image = backgroundImage(relativeUrl, rootUrlWithPath);
    assert.equal(image, imageUrl);
  });

  it('extracts a url with spacing', () => {
    const urlWithSpacing = `whatever:blah; background-image: url('${imageUrl}')`;
    const imageWithSpacing = backgroundImage(urlWithSpacing, rootUrl);
    assert.equal(imageWithSpacing, imageUrl);
  });

  it('extracts a url without spacing', () => {
    const urlWithoutSpacing = `whatever:blah; background-image:url('${imageUrl}')`;
    const imageWithoutSpacing = backgroundImage(urlWithoutSpacing, rootUrl);
    assert.equal(imageWithoutSpacing, imageUrl);
  });

  it('extracts a url without quotes', () => {
    const urlWithoutQuotes = `whatever:blah; background-image:url(${imageUrl})`;
    const imageWithoutQuotes = backgroundImage(urlWithoutQuotes, rootUrl);
    assert.equal(imageWithoutQuotes, imageUrl);
  });

  it('extracts a url with single quotes', () => {
    const urlWithSingleQuotes = `whatever:blah; background-image:url('${imageUrl}')`;
    const imageWithSingleQuotes = backgroundImage(urlWithSingleQuotes, rootUrl);
    assert.equal(imageWithSingleQuotes, imageUrl);
  });

  it('extracts a url with double quotes', () => {
    const urlWithDoubleQuotes = `whatever:blah; background-image:url("${imageUrl}")`;
    const imageWithDoubleQuotes = backgroundImage(urlWithDoubleQuotes, rootUrl);
    assert.equal(imageWithDoubleQuotes, imageUrl);
  });

  it('returns null if the url is empty', () => {
    assert.equal(backgroundImage('', 'whatever'), null);
  });

  it('returns null if the url is invalid', () => {
    assert.equal(backgroundImage('whatever', 'whatever'), null);
  });
});
