import Fetcher from './fetcher';
import { Page } from '../fetcher/fetcher';

export default class PuppeteerFetcher implements Fetcher {
  private url: string;

  constructor(url) {
    this.url = url;
  }

  getPage(): Promise<Page> {
    return new Promise((resolve, reject) => {
      const page: Page = {
        encoding: '',
        contents: '',
        url: this.url,
      };

      resolve(page);
    });
  }
}
