import Fetcher from './fetcher';
import { ScrapedPage } from '../fetcher/fetcher';

export default class PuppeteerFetcher implements Fetcher {
  private url: string;

  constructor(url) {
    this.url = url;
  }

  getPage(): Promise<ScrapedPage> {
    return new Promise((resolve, reject) => {
      const page: ScrapedPage = {
        encoding: '',
        contents: '',
        url: this.url,
      };

      resolve(page);
    });
  }
}
