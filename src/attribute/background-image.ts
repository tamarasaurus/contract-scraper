import * as path from 'path'
import { Attribute } from './attribute';

 export default class BackgroundImage implements Attribute {
   private readonly value: string = null

   public constructor(style: string, root: string) {
    if (style === undefined || style === null || style.trim().length === 0) {
      return null
    }

     this.value = this.normalize([style, root])
  }

   public getValue(): string {
    return this.value
  }

   public normalize([style, root]): string {
    const url = new URL(root)
    const image = /(background-image:url\("|')(.*)("|'\))/.exec(style)
    if (image === null) return null

     const match = image[2].split('../')[1]

     if (!match.startsWith('http') && !match.startsWith('www')) {
      return `${url.protocol}//${path.join(url.host, match)}`
    }

     return match
  }
}