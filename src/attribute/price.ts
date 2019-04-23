import { Attribute } from './attribute';

export default class Price implements Attribute {
  private inputValue: string = null;

  public constructor(price: string) {
    this.inputValue = price;
  }

  public get value(): number {
    return this.normalize(this.inputValue);
  }

  public normalize(price: string): number {
    if (price === undefined || price === null) {
      return null;
    }

    const strippedString = price.replace(/\s+/g, '');
    const getValue = /\d+/gm;
    const parsedString = strippedString.match(getValue);

    if (parsedString === null || parsedString.length === 0) {
      return null;
    }

    return parseInt(parsedString[0], 10);
  }
}
