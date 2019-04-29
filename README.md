# contract-scraper

This package lets you scrape a HTML page and easily return the data in a structure that you define (a contract).

[![Build Status](https://travis-ci.org/tamarasaurus/contract-scraper.svg?branch=master)](https://travis-ci.org/tamarasaurus/contract-scraper)


## Installation

```bash
npm install contract-scraper --save
```


## Usage

Let's say that you want to scrape data about a list of toys from this HTML page:

```html
<html>
    <head>
      <title>Game of Thrones Action Figures</title>
    </head>
    <body>
      <ul>
        <li>
          <a href="http://characters.com/jonsnow" class="name">Jon Snow</a>
          <div data-profile style="background:red;background-image:url('http://images.com/jonsnow')">
        </li>
        <li>
          <a href="http://characters.com/nedstark" class="name">Ned Stark</a>
          <div data-profile style="background:red;background-image:url('http://images.com/nedstark')">
        </li>
      </ul>
    </body>
  </html>
```

You have the following properties that you can collect:
- Link `a[href]`
- Name `.name`
- Photo URL `[data-profile]`

So you can construct a contract with the following properties:

```javascript
const contract = {
  // The selector of the list item
  itemSelector: 'ul li',

  // Option to scrape with a headless browser
  scrapeAfterLoading: false,
  attributes: {
    name: {
      type: 'text',
      selector: '.name'
    },
    photo: {
      type: 'background-image',
      selector: '[data-profile]',
      attribute: 'style'
    },
    link: {
      type: 'link',
      selector: 'a',
      attribute: 'href'
    }
  },
};
```

For each attribute that you want to scrape, you have the following options:

| Property             	| Options                                                                                                                                          	| Description                                                                                                                                                              	|
|----------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| name                 	| 'text',  'background-image', 'price', 'size', 'link'                                                                                          	| Each attribute type is able to scrape data from a HTML element differently. See here for more: Attributes                                                                                                                                                                        	|
| selector             	| '.class'                                                                                                                                         	| Any jQuery/DOM selector that is compatible with https://github.com/cheeriojs/cheerio                                                                                     	|
| attribute (optional) 	| 'href'                                                                                                                                           	| You can use any HTML attribute that exists on the element that you want to scrape                                                                                        	|
| data (optional)      	| data: { name: 'country' } <div data-name="country">Country</div>  OR  data: {name: 'price', key: 'currency'} <div data-price="{currency: 'aud'}" 	| For a string, you can simply specify the name of the data attribute to scrape the contents. Otherwise you can specify the key if the data attribute contains some JSON.  	|


Once you have your contract ready, you can pass it to the scraper with a url:

```typescript
import Scraper from 'contract-scraper'

const scraper = new Scraper(
  'http://characters.com',
)

```

