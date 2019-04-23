import * as path from 'path';
import { Attribute } from './attribute';

export default class BackgroundImage implements Attribute {
  private readonly value: string = null;

  public constructor(style: string, root: string) {
    if (this.isEmpty(style)) {
      return null;
    }

    this.value = this.normalize([style, root]);
  }

  public getValue(): string {
    return this.value;
  }

  public normalize([style, root]: [string, string]): string {
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

  private urlIsAbsolute(url: string) {
    return !url.startsWith('http') && !url.startsWith('www');
  }

  private isEmpty(style: string) {
    return (style === undefined || style === null || style.trim().length === 0);
  }
}
