import { Attribute } from './attribute';

export default class Text implements Attribute {
  private inputValue: string;

  public constructor (inputValue: string) {
    this.inputValue = inputValue;
  }

  public get value() {
    return this.normalize(this.inputValue);
  }

  public normalize (value: string): string {
    if (value === undefined || value === null || value.trim().length === 0) {
      return null;
    }

    return value.trim();
  }
}
