import Fetcher from './fetcher';
import { ScrapedPage } from '../fetcher/fetcher';
import request from 'axios';
import randomUserAgent from 'random-useragent';
import { guessEncoding, encodePageContents } from '../tools/encoding';

export default class RequestFetcher implements Fetcher {
  private url: string;

  constructor(url) {
    this.url = url;
  }

  getPage(): Promise<ScrapedPage> {
    return this.getPageResponse().then((response) => {
      const { headers, data: body } = response;
      const encoding = guessEncoding(headers['Content-Type'] as string, body);
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

    return this.getRequestLibrary().get(this.url, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        Accept: 'text/html',
        'Accept-Language': 'fr-FR',
        'User-Agent': userAgent,
      },
    });
  }
}
