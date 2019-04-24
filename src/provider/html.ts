import { Provider } from './provider';
import { Page } from '../fetcher/fetcher';

export default class HTMLProvider implements Provider{
  private page: Page;
  private contract: any;
  private attributes: any;

  constructor(page, contract, attributes) {
    this.page = page;
    this.contract = contract;
    this.attributes = attributes;
  }

  getEncodedContents(contents: string) {
    return contents;
  }

  getScrapedItems(): Promise<[]> {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }
}
