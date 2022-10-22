import backgroundImage from '../../../src/attribute/background-image';

const rootUrl = 'http://website.com/';
const rootUrlWithPath = 'http://website.com/whatever/more/stuff';
const imageUrl = 'http://website.com/images/whatever.jpeg';
describe('creates a background image attribute', () => {
  it('extracts a full url from a style tag', () => {
    const fullUrl = `color:red;background-image:url('${imageUrl}')`;
    const image = backgroundImage(fullUrl, rootUrl);

    expect(image).toEqual(imageUrl);
  });

  it('extracts a relative url from a style tag', () => {
    const relativeUrl = `color:red;background-image:url('../images/whatever.jpeg')`;
    const image = backgroundImage(relativeUrl, rootUrl);
    expect(image).toEqual(imageUrl);
  });

  it('extracts a relative url from a style tag and returns the root', () => {
    const relativeUrl = `color:red;background-image:url('/images/whatever.jpeg')`;
    const image = backgroundImage(relativeUrl, rootUrlWithPath);
    expect(image).toEqual(imageUrl);
  });

  it('extracts a url with spacing', () => {
    const urlWithSpacing = `whatever:blah; background-image: url('${imageUrl}')`;
    const imageWithSpacing = backgroundImage(urlWithSpacing, rootUrl);
    expect(imageWithSpacing).toEqual(imageUrl);
  });

  it('extracts a url without spacing', () => {
    const urlWithoutSpacing = `whatever:blah; background-image:url('${imageUrl}')`;
    const imageWithoutSpacing = backgroundImage(urlWithoutSpacing, rootUrl);
    expect(imageWithoutSpacing).toEqual(imageUrl);
  });

  it('extracts a url without quotes', () => {
    const urlWithoutQuotes = `whatever:blah; background-image:url(${imageUrl})`;
    const imageWithoutQuotes = backgroundImage(urlWithoutQuotes, rootUrl);
    expect(imageWithoutQuotes).toEqual(imageUrl);
  });

  it('extracts a url with single quotes', () => {
    const urlWithSingleQuotes = `whatever:blah; background-image:url('${imageUrl}')`;
    const imageWithSingleQuotes = backgroundImage(urlWithSingleQuotes, rootUrl);
    expect(imageWithSingleQuotes).toEqual(imageUrl);
  });

  it('extracts a url with double quotes', () => {
    const urlWithDoubleQuotes = `whatever:blah; background-image:url("${imageUrl}")`;
    const imageWithDoubleQuotes = backgroundImage(urlWithDoubleQuotes, rootUrl);
    expect(imageWithDoubleQuotes).toEqual(imageUrl);
  });

  it('returns null if the url is empty', () => {
    expect(backgroundImage('', 'whatever')).toEqual(null);
  });

  it('returns null if the url is invalid', () => {
    expect(backgroundImage('whatever', 'http::!/whatever')).toEqual(null);
  });
});
