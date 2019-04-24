import { Provider } from './provider';
import { Page } from '../fetcher/fetcher';
import * as cheerio from 'cheerio';

export default class HTMLProvider implements Provider {
  private page: Page;
  private contract: any;
  private attributes: any;
  private $: CheerioStatic;

  constructor(page, contract, attributes) {
    this.page = page;
    this.contract = contract;
    this.attributes = attributes;
    this.$ = cheerio.load(this.page.contents);
  }

  public getItemOrParentElement(item: CheerioElement, selector: string): Cheerio {
    if (selector !== undefined) {
      return this.$(selector, item);
    }

    return this.$(item);
  }

  public getElementValue(element: Cheerio, attribute: string): string {
    if (attribute !== undefined) {
      const value = this.$(element).attr(attribute);
      return (value ? value.trim() : null);
    }

    return this.$(element).text().trim();
  }

  public getElementDataAttributeKeyValue(element: Cheerio, { name, key }): string | null {
    const value = this.$(element).data(name);

    if (name !== undefined && key !== undefined) {
      try {
        return value[key];
      } catch (e) {
        return null;
      }
    }

    return value;
  }

  mapElementToProperty(item: CheerioElement, options: any) {
    const { type, selector, attribute, data } = options;

    const element = this.getItemOrParentElement(item, selector);
    const value = this.getElementValue(element, attribute);

    if (data !== undefined) {
      return this.getElementDataAttributeKeyValue(element, data);
    }

    const AttributeType = this.attributes[type];
    const scrapedAttribute = new AttributeType(value, this.page.url);

    return scrapedAttribute.value;
  }

  getScrapedItems(): any[] {
    const elements = this.$(this.contract.itemSelector).toArray();
    const scrapedItems = [];

    elements.forEach((element: CheerioElement) => {
      const scrapedItem = {};

      Object.entries(this.contract.attributes).forEach(([name, options]) => {
        scrapedItem[name] = this.mapElementToProperty(element, options);
      });

      scrapedItems.push(scrapedItem);
    });

    return scrapedItems;
  }
}
