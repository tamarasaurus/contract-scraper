import * as path from 'path';
import { Attribute } from './attribute';

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
      const url = new URL(root);
      const image = /(background-image:\s?url\((.*)?)\)/.exec(style);
      const match = image[2].replace(/'|"/g, '');

      if (this.urlIsAbsolute(match)) {
        return `${root}${path.join(url.host, match)}`;
      }

      return match;
    } catch (e) {
      return null;
    }
  }

  private urlIsAbsolute(url: string): boolean {
    return !url.startsWith('http') && !url.startsWith('www');
  }

  private isEmpty(style: string): boolean {
    return (style === undefined || style === null || style.trim().length === 0);
  }
}
