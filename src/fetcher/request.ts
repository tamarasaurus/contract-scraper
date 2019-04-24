import Fetcher from './fetcher';
import { ScrapedPage } from '../fetcher/fetcher';
import request from 'request-promise';
import randomUserAgent from 'random-useragent';
import { guessEncoding, encodePageContents } from '../tools/encoding';

export default class RequestFetcher implements Fetcher {
  private url: string;

  constructor(url) {
    this.url = url;
  }

  getPage(): Promise<ScrapedPage> {
    return this.getPageResponse().then((response) => {
      const { headers, body } = response;
      const encoding = guessEncoding(headers['Content-Type'], body);
      const page: ScrapedPage = {
        encoding,
        contents: encodePageContents(encoding, body),
        url: this.url,
      };

      return page;
    });
  }

  getRequestLibrary() {
    return request;
  }

  getPageResponse() {
    const userAgent = randomUserAgent.getRandom();

    return this.getRequestLibrary().get({
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
