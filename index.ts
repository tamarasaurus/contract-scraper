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
import buildSchema from './src/contract-schema';
import RequestFetcher from './src/fetcher/request';
import * as cheerio from 'cheerio';
import { PuppeteerNodeLaunchOptions } from 'puppeteer';

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
  private puppeteerOptions: PuppeteerNodeLaunchOptions;

  constructor(
    url: string,
    contract: any,
    attributes: Attributes = {},
    puppeteerOptions?: PuppeteerNodeLaunchOptions,
  ) {
    this.url = url;
    this.contract = contract;
    this.attributes = attributes;
    this.puppeteerOptions = puppeteerOptions;
  }

  public scrapePage(): Promise<any[]> {
    const attributes = this.getAttributes();
    const { message } = this.contractIsValid(attributes);

    if (!this.urlIsValid()) {
      throw Error(`The URL "${this.url}" you have provided is invalid`);
    }

    if (message) {
      throw Error(message);
    }

    const fetcher = this.getFetcher();
    return fetcher.getPage().then((page: ScrapedPage) => {
      return this.getScrapedItems(page, attributes);
    });
  }

  public async getPageContents(): Promise<{
    page: ScrapedPage;
    $: cheerio.Root;
  }> {
    const attributes = this.getAttributes();
    const { message } = this.contractIsValid(attributes);

    if (!this.urlIsValid()) {
      throw Error(`The URL "${this.url}" you have provided is invalid`);
    }

    if (message) {
      throw Error(message);
    }

    const fetcher = this.getFetcher();
    const page = await fetcher.getPage();

    return {
      page,
      $: cheerio.load(page.contents),
    };
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

  public contractIsValid(attributes: { [name: string]: any }): {
    message: string | null;
  } {
    if (this.contract === null || this.contract === undefined) {
      return {
        message: 'Your contract is invalid, please check the specifications',
      };
    }

    const schema = buildSchema(Object.keys(attributes));
    const { error } = schema.validate(this.contract);
    return { message: error };
  }

  public getFetcher(): Fetcher {
    if (this.contract.puppeteer === true) {
      return new PuppeteerFetcher(
        this.url,
        this.contract.waitForPageLoadSelector,
        this.puppeteerOptions,
      );
    }

    return new RequestFetcher(this.url);
  }

  public getProvider(page: ScrapedPage, attributes: any): Provider {
    if (this.contract.scriptTagSelector) {
      return new ScriptTagProvider(page, this.contract, attributes);
    }

    return new HTMLProvider(page, this.contract, attributes);
  }
}

export default Scraper;
