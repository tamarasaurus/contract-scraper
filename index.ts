import backgroundImage from './src/attribute/background-image';
import link from './src/attribute/link';
import number from './src/attribute/number';
import size from './src/attribute/size';
import text from './src/attribute/text';

import PuppeteerFetcher from './src/fetcher/puppeteer';
import Fetcher, { ScrapedPage } from './src/fetcher/fetcher';
import { Provider } from './src/provider/provider';
import HTMLProvider from './src/provider/html';
import ScriptTagProvider from './src/provider/script-tag';

interface Attributes {
  [name: string]: any;
}

class Scraper {
  public defaultAttributes: any = {
    'background-image': backgroundImage,
    link,
    number,
    size,
    text,
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
    const fetcher = this.getFetcher();

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

  public getFetcher(): Fetcher {
    return new PuppeteerFetcher(this.url);
  }

  public getProvider(page: ScrapedPage, attributes: any): Provider {
    if (this.contract.scriptTagSelector) {
      return new ScriptTagProvider(page, this.contract, attributes);
    }

    return new HTMLProvider(page, this.contract, attributes);
  }
}

export default Scraper;
