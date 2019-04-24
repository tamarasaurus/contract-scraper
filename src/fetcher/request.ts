import Fetcher from './fetcher';
import { Page } from '../fetcher/fetcher';
import request from 'request';
import randomUserAgent from 'random-useragent';
import { guessEncoding } from '../tools/encoding';

export default class RequestFetcher implements Fetcher {
  private url: string;

  constructor(url) {
    this.url = url;
  }

  getPage(): Promise<Page> {
    return this.getPageResponse().then((response) => {
      const { headers, body } = response;
      const page: Page = {
        encoding: guessEncoding(headers, body),
        contents: body,
      };

      return page;
    });
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
