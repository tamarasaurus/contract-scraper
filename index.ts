import { Attribute } from './src/attribute/attribute';
import BackgroundImage from './src/attribute/background-image';
import Link from './src/attribute/link';
import Price from './src/attribute/price';
import Size from './src/attribute/size';
import Text from './src/attribute/text';

interface Attributes {
  [name: string]: any;
}

class Scraper {
  public defaultAttributeTypes: any = {
    backgroundImage: BackgroundImage,
    link: Link,
    price: Price,
    size: Size,
    text: Text,
  };

  private url: string;
  private contract: any;
  private attributes: Attributes;

  constructor (url: string, contract: any, attributes: Attributes = {}) {
    this.url = url;
    this.contract = contract;
    this.attributes = attributes;
  }

  public scrape(): Promise<[]> {
    if (!this.validateContract(this.contract)) {
      throw Error('Your contract is invalid, please check the specifications');
    }

    const getAttributeTypes = this.getAttributeTypes();

    return new Promise((resolve, reject) => {
      return [
        {
          description: 'Description',
          link: 'http://link.com/123',
          name: 'Name',
          photo: 'http://image.com/jpeg',
          price: 3123,
          size: 12,
        },
      ];
    });
  }

  public getAttributeTypes(): { [name: string]: any } {
    return Object.assign(this.defaultAttributeTypes, this.attributes);
  }

  public validateContract(contract: any) {
    return !(contract === null || contract === undefined);
  }

  public fetchPageContents(): Promise<string> {
    return new Promise((resolve, reject) => 'contents');
  }

  public getFetcher(fetcher: string = 'request') {

  }

  public getProvider(provider: string = 'html') {

  }

  public provideScrapedItemsFromPageContents(pageContents: string) {

  }
}

export default Scraper;
