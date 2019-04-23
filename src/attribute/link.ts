import * as path from 'path';
import { Attribute } from './attribute';

export default class Link implements Attribute {
  private inputValue: [string, string] = null;

  public constructor(link: string, root: string) {
    this.inputValue = [link, root];
  }

  public get value(): string {
    const [link, root] = this.inputValue;
    return this.normalize([link, root]);
  }

  public normalize([link, root]: [string, string]): string {
    if (link === undefined || link === null || link.trim().length === 0) {
      return null;
    }

    const url = new URL(root);

    if (!link.startsWith('http') && !link.startsWith('www')) {
      return `${url.protocol}//${path.join(url.host, link)}`;
    }

    return link.trim();
  }
}
