import * as path from 'path';
import { Attribute } from './attribute';

export default class Link implements Attribute {
  private value: string = null;

  public constructor(link: string, root: string) {
    if (link === undefined || link === null || link.trim().length === 0) {
      return null;
    }

    this.value = this.normalize([link, root]);
  }

  public getValue(): string {
    return this.value;
  }

  public normalize([link, root]: [string, string]): string {
    const url = new URL(root);

    if (!link.startsWith('http') && !link.startsWith('www')) {
      return `${url.protocol}//${path.join(url.host, link)}`;
    }

    return link.trim();
  }
}
