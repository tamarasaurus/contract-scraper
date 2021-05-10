import { Provider } from './provider';
import { ScrapedPage } from '../fetcher/fetcher';
import * as cheerio from 'cheerio';

export default class HTMLProvider implements Provider {
  private page: ScrapedPage;
  private contract: any;
  private attributes: any;
  private $: cheerio.Root;

  constructor(page, contract, attributes) {
    this.page = page;
    this.contract = contract;
    this.attributes = attributes;
    this.$ = cheerio.load(this.page.contents);
  }

  public getItemOrParentElement(item: cheerio.Element, selector: string): cheerio.Cheerio {
    if (selector !== undefined) {
      return this.$(selector, item);
    }

    return this.$(item);
  }

  public getElementValue(element: cheerio.Cheerio, attribute: string, raw: boolean): string {
    if (attribute !== undefined) {
      const value = this.$(element).attr(attribute);
      return (value ? value.trim() : null);
    }

    if (raw === true) {
      return this.$(element).html();
    }

    return this.$(element).text().trim();
  }

  public getElementDataAttributeKeyValue(element: cheerio.Cheerio, { name, key }): string | null {
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

  mapElementToProperty(item: cheerio.Element, options: any) {
    const { type, selector, attribute, data, raw } = options;

    const element = this.getItemOrParentElement(item, selector);
    const value = this.getElementValue(element, attribute, raw);

    if (data !== undefined) {
      // TODO parse by attribute type
      return this.getElementDataAttributeKeyValue(element, data);
    }

    const getValueAsAttribute = this.attributes[type];

    if (getValueAsAttribute === undefined) {
      throw Error(`The attribute type ${type} isn't defined, did you pass it to the scraper?`);
    }

    return getValueAsAttribute(value, this.page.url)
  }

  getScrapedItems(): any[] {
    const elements = this.$(this.contract.itemSelector).toArray();
    const scrapedItems = [];

    elements.forEach((element: cheerio.Element) => {
      const scrapedItem = {};

      Object.entries(this.contract.attributes).forEach(([name, options]: [string, any]) => {
        if (options.itemSelector !== undefined) {
          const childElements = this.$(options.itemSelector, element).toArray();
          scrapedItem[name] = [];

          childElements.forEach((childElement: cheerio.Element) => {
            const childValues = {};
            Object.entries(options.attributes).forEach(([childName, childOptions]: [string, any]) => {
              childValues[childName] = this.mapElementToProperty(childElement, childOptions);
            });
            scrapedItem[name].push(childValues);
          });
        } else {
          scrapedItem[name] = this.mapElementToProperty(element, options);
        }
      });

      scrapedItems.push(scrapedItem);
    });

    return scrapedItems;
  }
}
