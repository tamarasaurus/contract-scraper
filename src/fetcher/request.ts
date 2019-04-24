import Fetcher from './fetcher';
import { Page } from '../fetcher/fetcher';
import request from 'request-promise';
import randomUserAgent from 'random-useragent';
import { guessEncoding, encodePageContents } from '../tools/encoding';

export default class RequestFetcher implements Fetcher {
  private url: string;

  constructor(url) {
    this.url = url;
  }

  getPage(): Promise<Page> {
    return this.getPageResponse().then((response) => {
      const { headers, body } = response;
      const encoding = guessEncoding(headers, body);
      const page: Page = {
        encoding,
        contents: encodePageContents(encoding, body),
        url: this.url,
      };

      return page;
    });
  }

  encodePageContents(encoding: string, contents: string): string {
    return encodePageContents(encoding, contents);
  }

  getPageResponse() {
    const userAgent = randomUserAgent.getRandom();

    return request.get({
      url: this.url,
      gzip: true,
      proxy: null,
      encoding: 'utf-8',
      resolveWithFullResponse: true,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Accept': 'text/html',
        'Accept-Language': 'fr-FR',
        'User-Agent': userAgent,
      }});
  }
}
