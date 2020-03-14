# contract-scraper

With contract-scraper you can easily scrape a HTML page and return the data in a structured format.

[![Build Status](https://travis-ci.org/tamarasaurus/contract-scraper.svg?branch=master)](https://travis-ci.org/tamarasaurus/contract-scraper)

## Installation

```bash
npm install contract-scraper --save
```

## Usage

To scrape a page, you can create a new instance of `contract-scraper` with these parameters:

```javascript
let contract = {
  itemSelector: 'li',
  scrapeAfterLoading: false,
  attributes: {
    name: {
      type: 'text',
      selector: '.name'
    },
    link: {
      type: 'link',
      selector: 'a',
      attribute: 'href'
    }
  }
}

const scraper = new Scraper('http://website.com', contract)
```

A contract accepts the following properties:

### `itemSelector` (string)

  A CSS selector for the element to be scraped. The scraper will process all the elements matching this selector.

### `scrapeAfterLoading` (boolean = false)

  Setting `true` will use `puppeteer` to fully load the URL, otherwise the scraper will use `request` to simply request the static HTML of the page. Puppeteer can be useful when the page uses lazy loading for images or other content.

### `attributes` (object)

Defines the data to scrape for each item.

Each attribute matches a HTML element to scrape. The attribute type will define how data wil be extracted from the element, and how the data should be formatted in the final output. For example you can use one of the in-built types to extract a number from an element:

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

Each attribute can have the following properties:

  * `name` (string) - A label for this attribute for the final output
  * `selector` (string) - The CSS selector for the element (scoped to itemSelector).
  * `type` (string) - A custom type, or one of the in-built ones that returns:
    * `background-image`: A background-image url from a style string
    * `link`: An absolute URL
    * `digit`: A number
    * `size`: A number for size in m².
    * `text`: Inner text of the element
  * `attribute (optional)` (string)

    The name of the HTML attribute to scrape data from. E.g. for an element:
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
    By default the attribute type will use the innerText of the element if `attribute` is not specified.
  * `data (optional)` (object) - If you want to scrape HTML data attributes you can do it in two ways:
    * Directly scraping a data attribute:
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
        data: { name: 'price', key: 'currency'}
      }
      ````
      This will return "aud" in your list of results.

### Nested attributes

It's also possible to scrape nested attributes, like a list inside an item:

```html
<ul class="friends">
  <li>
    <span>Spiderman</span>
    <ul>
      <li><strong>Iron</strong><em>Man</em></li>
      <li><strong>Captain</strong><em>America</em></li>
    </ul>
  </li>
</ul>
```

The contract:
```json
{
  "itemSelector": ".friends li",
  "attributes": {
    "name": { "type": "text", "selector": "span" },
    "friends": {
      "itemSelector": "ul li",
      "attributes": {
        "firstName": { "type": "text", "selector": "strong" },
        "lastName": { "type": "text", "selector": "em" }
      }
    }
  }
}
```

So this will return all the `friends` as an array (using any type):
```javascript
[
  {
    name: 'Spiderman',
    friends: [
      { firstName: 'Iron', lastName: 'Man' },
      { firstName: 'Captain', lastName: 'America' },
    ]
  }
]
```

## Custom attributes types

In addition to the in-built attribute types, you can provide your own when you create a new instance of the scraper. A custom attribute type needs to be a class or a function that has a `value` property. As a constructor argument it will receive the string innerText value from the matching element. Then you can format it however you like.

For example if you wanted to extract a list of tags and format them as an array:

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
      selector: '.name'
    },
    tags: {
      type: 'list',
      selector: '.tags'
    }
  }
}

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

## Parsing JSON inside script tags

Sometimes you may want to extract values from inside a script tag on the page. For the moment, `contract-scraper` only supports parsing JSON. For example:

```html
<html>
  <head>
    <title>Page with a script tag</title>
  </head>
  <body>
    <script type="application/ld+json" id="info">
      {
        "characters": [
          {
            "name": "Jon Snow",
            "friends": [
              { "firstName": "Sansa", "lastName": "Stark" },
              { "firstName": "Bran", "lastName": "Stark" },
              { "firstName": "Arya", "lastName": "Stark" }
            ],
            "photo": "http://images.com/jonsnow",
            "price": {
              "amount": '12345 dollars'
            }
          },
          {
            "name": "Ned Stark",
            "friends": [
              { "firstName": "Sansa", "lastName": "Stark" },
              { "firstName": "Bobby", "lastName": "B" },
              { "firstName": "Little", "lastName": "finger" }
            ],
            "photo": "http://images.com/nedstark",
            "price": {
              "amount": '6789 euros'
            }
          }
        ]
      }
    </script>
  </body>
```

```javascript
  const contract = {
    scriptTagSelector: "#info",
    itemSelector: 'characters',
    scrapeAfterLoading: false,
    attributes: {
      name: { type: 'text', selector: 'name' },
      friends: {
        itemSelector: 'friends', attributes: {
          firstName: { type: 'text', selector: 'firstName' },
          lastName: { type: 'text', selector: 'lastName' }
        }
      },
      photo: { type: 'link', selector: 'photo' },
      price: { type: 'digit', selector: 'price.amount' },
    },
  };

const scraper = new Scraper(
  'http://characters.com',
  contract
)

scraper.scrapePage().then(items => {
  console.log(items)
// [
//   {
//     "name": "Jon Snow",
//     "friends": [
//       {
//         "firstName": "Sansa",
//         "lastName": "Stark"
//       },
//       {
//         "firstName": "Bran",
//         "lastName": "Stark"
//       },
//       {
//         "firstName": "Arya",
//         "lastName": "Stark"
//       }
//     ],
//     "photo": "http://images.com/jonsnow",
//     "price": 12345
//   },
//   {
//     "name": "Ned Stark",
//     "friends": [
//       {
//         "firstName": "Sansa",
//         "lastName": "Stark"
//       },
//       {
//         "firstName": "Bobby",
//         "lastName": "B"
//       },
//       {
//         "firstName": "Little",
//         "lastName": "finger"
//       }
//     ],
//     "photo": "http://images.com/nedstark",
//     "price": 6789
//   }
// ]
})

```