import * as jschardet from 'jschardet';
import * as cheerio from 'cheerio';

function getCharsetFromContentType(contentType: string) {
  const regex = /(?<=charset=)[^;]*/gm;
  const charset = regex.exec(contentType);
  return charset;
}

function getContentTypeFromHTML(contents: string) {
  const $ = cheerio.load(contents)
  return $('meta[charset]').attr('charset');
}

export function guessEncoding(contentType: string, contents: string) {
  const headerCharset = getCharsetFromContentType(contentType);

  if (headerCharset) {
    return headerCharset;
  }

  const metaCharset = getContentTypeFromHTML(contents)

  if (metaCharset) {
    return metaCharset;
  }

  return jschardet.detect(contents).encoding;
}
