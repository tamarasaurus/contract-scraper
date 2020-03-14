import { Attribute } from './attribute';

export default class Digit implements Attribute {
  private inputValue: string = null;

  public constructor(digit: string) {
    this.inputValue = digit;
  }

  public get value(): number {
    return this.normalize(this.inputValue);
  }

  public normalize(digit: string): number {
    if (digit === undefined || digit === null) {
      return null;
    }

    const strippedString = digit.toString().replace(/\s+/g, '');
    const getValue = /\d+/gm;
    const parsedString = strippedString.match(getValue);

    if (parsedString === null || parsedString.length === 0) {
      return null;
    }

    return parseInt(parsedString[0], 10);
  }
}
