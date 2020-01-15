import * as url from 'url';
import { Attribute } from './attribute';
import isRelativeUrl from 'is-relative-url';

export default class BackgroundImage implements Attribute {
  private inputValue: [string, string];

  public constructor(style: string, root: string) {
    this.inputValue = [style, root];
  }

  public get value(): string {
    const [style, root] = this.inputValue;
    return this.normalize([style, root]);
  }

  public normalize([style, root]: [string, string]): string {
    if (this.isEmpty(style)) {
      return null;
    }

    try {
      const base = new URL(root);
      const image = /(background-image:\s?url\((.*)?)\)/.exec(style);
      const match = image[2].replace(/'|"/g, '');

      if (isRelativeUrl(match)) {
        return url.resolve(base.origin, match);
      }

      return match;
    } catch (e) {
      return null;
    }
  }

  private isEmpty(style: string): boolean {
    return (style === undefined || style === null || style.trim().length === 0);
  }
}
