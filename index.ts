import BackgroundImage from './src/attribute/background-image';
import Link from './src/attribute/link';
import Price from './src/attribute/price';
import Size from './src/attribute/size';
import Text from './src/attribute/text';

import PuppeteerFetcher from './src/fetcher/puppeteer';
import RequestFetcher from './src/fetcher/request';
import Fetcher, { Page } from './src/fetcher/fetcher';
import { Provider } from './src/provider/provider';
import HTMLProvider from './src/provider/html';

interface Attributes {
  [name: string]: any;
}

class Scraper {
  public defaultAttributes: any = {
    backgroundImage: BackgroundImage,
    link: Link,
    price: Price,
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

  public getDataFromPage(): Promise<any[]> {
    if (!this.contractIsValid()) {
      throw Error('Your contract is invalid, please check the specifications');
    }

    if (!this.urlIsValid()) {
      throw Error(`The URL "${this.url}" you have provided is invalid`);
    }

    const attributes = this.getAttributes();
    const fetcher = this.getFetcher(this.contract.scrapeAfterLoading);

    return fetcher.getPage().then((page: Page) => {
      return this.getScrapedItems(page, attributes);
    });
  }

  public getScrapedItems(page: Page, attributes: any) {
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

  public getProvider(page: Page, attributes: any): Provider {
    return new HTMLProvider(page, this.contract, attributes);
  }
}

export default Scraper;
