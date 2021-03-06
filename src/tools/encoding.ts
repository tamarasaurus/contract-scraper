import * as jschardet from 'jschardet';
import * as cheerio from 'cheerio';
import * as Iconv from 'iconv';

function getCharsetFromContentType(contentType: string) {
  const regex = /(?<=charset=)[^;]*/gm;
  const charset = regex.exec(contentType);

  if (charset === null) return;

  return charset[0];
}

function getContentTypeFromHTML(contents: string) {
  const $ = cheerio.load(contents);
  return $('meta[charset]').attr('charset');
}

export function getContentTypeHeaders(headers: any) {
  return headers['content-type'] || headers['Content-type'] || headers['Content-Type'];
}

export function encodePageContents(encoding: string, contents: string) {
  const lib: any = Iconv;
  const converter: any = lib['Iconv'];
  const iconv = new converter(encoding, 'UTF-8//IGNORE//TRANSLIT');

  if (encoding.toLowerCase().includes('windows-')) {
    return contents;
  }

  return iconv.convert(contents).toString('utf-8');
}

export function guessEncoding(contentType: string, contents: string) {
  const headerCharset = getCharsetFromContentType(contentType);

  if (headerCharset) {
    return headerCharset;
  }

  const metaCharset = getContentTypeFromHTML(contents);

  if (metaCharset) {
    return metaCharset;
  }

  return jschardet.detect(Buffer.from(contents)).encoding;
}