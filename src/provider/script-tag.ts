import { Provider } from './provider';
import { ScrapedPage } from '../fetcher/fetcher';
import * as cheerio from 'cheerio';
import get from 'lodash.get';

export default class ScriptTagProvider implements Provider {
  private page: ScrapedPage;
  private contract: any;
  private attributes: any;
  private contents: any;
  private $: CheerioStatic;

  constructor(page, contract, attributes) {
    this.page = page;
    this.contract = contract;
    this.attributes = attributes;
    this.$ = cheerio.load(this.page.contents);
    this.contents = this.parseScriptTagContents();
  }

  mapElementToProperty(item: any, options: any) {
    const { type, selector } = options;
    const value = get(item, selector);
    const AttributeType = this.attributes[type];

    if (AttributeType === undefined) {
      throw Error(`The attribute type ${type} isn't defined, did you pass it to the scraper?`);
    }

    const scrapedAttribute = new AttributeType(value, this.page.url);

    return scrapedAttribute.value;
  }

  parseScriptTagContents(): any {
    const { scriptTagSelector } = this.contract;
    const contents = this.$(scriptTagSelector).html();

    if (!contents || contents.length === 0) return;
    return JSON.parse(contents);
  }

  getScrapedItems(): any[] {
    const scrapedItems = [];
    const itemArray = get(this.contents, this.contract.itemSelector);

    itemArray.forEach((item: any) => {
      const scrapedItem = {};

      Object.entries(this.contract.attributes).forEach(([name, options]: [string, any]) => {
        if (options.itemSelector !== undefined) {
          const childElements = get(item, options.itemSelector);
          scrapedItem[name] = [];

          childElements.forEach((childElement: CheerioElement) => {
            const childValues = {};
            Object.entries(options.attributes).forEach(([childName, childOptions]: [string, any]) => {
              childValues[childName] = this.mapElementToProperty(childElement, childOptions);
            });
            scrapedItem[name].push(childValues);
          });
        } else {
          scrapedItem[name] = this.mapElementToProperty(item, options);
        }
      });

      scrapedItems.push(scrapedItem);
    });

    return scrapedItems;
  }
}
