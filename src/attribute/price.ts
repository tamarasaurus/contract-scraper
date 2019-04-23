import { Attribute } from './attribute';

export default class Price implements Attribute {
  private value: number = null;

  public constructor(price: string) {
    if (price === undefined || price === null) {
      return null;
    }

    this.value = this.normalize(price);
  }

  public getValue(): number {
    return this.value;
  }

  public normalize(price: string): number {
    const strippedString = price.replace(/\s+/g, '');
    const getValue = /\d+/gm;
    const parsedString = strippedString.match(getValue);

    if (parsedString === null || parsedString.length === 0) {
      return null;
    }

    return parseInt(parsedString[0], 10);
  }
}
