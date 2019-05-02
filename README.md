# contract-scraper

With contract-scraper you can scrape a HTML page and easily return the data as an array of objects in a structure that you define.

[![Build Status](https://travis-ci.org/tamarasaurus/contract-scraper.svg?branch=master)](https://travis-ci.org/tamarasaurus/contract-scraper)
s

## Installation

```bash
npm install contract-scraper --save
```

## Usage

Let's say that you want to scrape data about a list of toys from a HTML page:

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
- Name `.name`
- Photo URL `[data-profile]`
- Link `a[href]`

So you can use `contract-scraper` to scrape the page and return an array of JSON objects with the values of these properties:

```javascript
import Scraper from 'contract-scraper'

// Tell contract-scraper which selectors to scrape, and from where
const contract = {
  // The selector for an individual item on the page
  itemSelector: 'ul li',

  // Whether or not to use puppeteer to scrape the page
  scrapeAfterLoading: false,

  // A list of properties to scrape for each item
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

// Create a new instance of the scraper with a URL and contract
const scraper = new Scraper(
  'http://characters.com',
  contract
)

// Resolve a promise that returns a list of scraped items
scraper.scrapePage().then((items) => {
  console.log(items);
  // [
  //   {
  //     name: 'Jon Snow',
  //     photo: 'http://images.com/jonsnow',
  //     link: 'http://characters.com/jonsnow'
  //   },
  //   {
  //     name: 'Ned Stark',
  //     photo: 'http://images.com/nedstark',
  //     link: 'http://characters.com/nedstark'
  //   }
  // ]
})

```

You create a new instance of the scraper by passing in a contract, the URL that you want to scrape, and optionally custom attribute types.

The contract can have the following properties:

* `itemSelector` (string) - A CSS selector for the set of items that you want to scrape. E.g. `ul li`
* `scrapeAfterLoading` (boolean = false) - Whether or not the provided URL needs to load with a browser before scraping.
* `attributes` (object) - An object that defines the properties that you want to scrape.

Each attribute in your contract represents some data that you want to scrape and format. Each attribute can have a type, which tells the scraper how the value should be formatted for the final output. For example, you can tell the scraper to only extract a number from an element for the following page:

```html
<ul>
  <li>
    <div class="name">Iron man</div>
    <div class="price">100 euros</div>
  </li>
  <li>
    <div class="name">Captain America</div>
    <div class="price">500 euros</div>
  </li>
<ul>
```

```javascript
const contract = {
  itemSelector: 'li',
  scrapeAfterLoading: false,
  attributes: {
    name: {
      type: 'text',
      selector: '.name'
    },
    price: {
      type: 'digit',
      selector: '.price'
    }
  }
}

const scraper = new Scraper(
  'http://characters.com',
  contract
)

scraper.scrapePage().then(items => {
  console.log(items)
  // [
  //   {
  //     name: 'Iron man',
  //     price: 100
  //   },
  //       {
  //     name: 'Captain America',
  //     price: 500
  //   }
  // ]
})

```

By using the in-built attribute type `digit`, you can tell the scraper that you only want the number from the contents of the element.

Each attribute represents a HTML element to scrape, and it can have the following properties:

  * `name` (string) - The name of the property to return in the final list of results
  * `selector` (string) - The CSS selector for the element that matches this attribute.
  * `type` (string) - One of the in-built types that tells the scraper how to format the contents of this element:
    * `background-image`: Use this when you want to extract a background-image url from a style tag.
    * `link`: For scraping an absolute or relative link from an element
    * `digit`: For returning a number from a string
    * `size`: Use this for extracting a number from a string for a size in m².
    * `text`: Returns trimmed text from an element.
  * `attribute (optional)` (string) - The name of the HTML attribute to scrape data from. E.g. for an element:
    ```html
      <a href="http://linktoscrape">Homepage</a>
    ```
    ```javascript
      {
        name: 'URL',
        type: 'link',
        selector: 'a',
        attribute: 'href'
      }
    ```
    By default the scraper will format the inner text of the element if `attribute` is not specified.
  * `data (optional)` (object) - If you want to scrape data attributes you can do it in two ways:
    * For directly scraping a data attribute:
      ```html
      <div data-country="Australia">
      ```
      ```javascript
      {
        name: 'Country',
        type: 'text',
        selector: 'data-country',
        data: { name: 'country' }
      }
      ```
      This will return "Australia" in your list of results.
    * For scraping a JSON value inside a data attribute:
      ```html
      <div data-price="{currency: 'aud'}"></div>
      ```
      ```javascript
      {
        name: 'Price',
        type: 'digit',
        selector: 'data-price',
        data: {name: 'price', key: 'currency'}
      }
      ````
      This will return "aud" in your list of results.

## Custom attributes types

In addition to the in-built attribute types, you can provide your own when you create a new instance of the scraper. A custom attribute type needs to be a class or a function that has a `value` property. For example if you wanted to extract a list of tags as an array:

```html
<ul>
  <li>
    <div class="name">Australia</div>
    <div class="tags">spiders,vegemite,scorching,heat</div>
  </li>
</ul>
```

```javascript
import Scraper from 'contract-scraper';

const contract = {
  itemSelector: 'li',
  scrapeAfterLoading: false,
  attributes: {
    countryName: {
      type: 'text',
      selector: 'name'
    },
    tags: {
      type: 'list',
      selector: '.tags'
    }
  }
}

// The custom type that receives the raw string as an argument
function ListFromString(commaSeparatedString) {
  this.value = commaSeparatedString.split(',');
}

const scraper = new Scraper(
  'http://countries.com',
  contract,
  { 'list': ListFromString }
)

scraper.scrapePage().then(items => {
  console.log(items);
  // [
  //   {
  //     countryName: 'Australia',
  //     tags: [ 'spiders', 'vegemite', 'scorching', 'heat' ]
  //   }
  // ]
})

```


