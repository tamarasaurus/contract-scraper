import BackgroundImage from './src/attribute/background-image';
import Link from './src/attribute/link';
import Digit from './src/attribute/digit';
import Size from './src/attribute/size';
import Text from './src/attribute/text';

import PuppeteerFetcher from './src/fetcher/puppeteer';
import RequestFetcher from './src/fetcher/request';
import Fetcher, { ScrapedPage } from './src/fetcher/fetcher';
import { Provider } from './src/provider/provider';
import HTMLProvider from './src/provider/html';

interface Attributes {
  [name: string]: any;
}

class Scraper {
  public defaultAttributes: any = {
    'background-image': BackgroundImage,
    link: Link,
    digit: Digit,
    size: Size,
    text: Text,
  };

  private url: string;
  private contract: any;
  private attributes: Attributes;

  constructor(url: string, contract: any, attributes: Attributes = {}) {
    this.url = url;
    this.contract = contract;
    this.attributes = attributes;
  }

  public scrapePage(): Promise<any[]> {
    if (!this.contractIsValid()) {
      throw Error('Your contract is invalid, please check the specifications');
    }

    if (!this.urlIsValid()) {
      throw Error(`The URL "${this.url}" you have provided is invalid`);
    }

    const attributes = this.getAttributes();
    const fetcher = this.getFetcher(this.contract.scrapeAfterLoading);

    return fetcher.getPage().then((page: ScrapedPage) => {
      return this.getScrapedItems(page, attributes);
    });
  }

  public getScrapedItems(page: ScrapedPage, attributes: any) {
    return this.getProvider(page, attributes).getScrapedItems();
  }

  public getAttributes(): { [name: string]: any } {
    return Object.assign(this.defaultAttributes, this.attributes);
  }

  public urlIsValid(): boolean {
    try {
      new URL(this.url);

      return true;
    } catch (e) {
      return false;
    }
  }

  public contractIsValid(): boolean {
    return !(this.contract === null || this.contract === undefined);
  }

  public getFetcher(scrapeAfterLoading: boolean = false): Fetcher {
    if (scrapeAfterLoading) {
      return new PuppeteerFetcher(this.url);
    }

    return new RequestFetcher(this.url);
  }

  public getProvider(page: ScrapedPage, attributes: any): Provider {
    return new HTMLProvider(page, this.contract, attributes);
  }
}

export default Scraper;

export {
  PuppeteerFetcher,
  RequestFetcher,
  HTMLProvider,
};
