import Scraper from '../../index';
import { ScrapedPage } from '../../src/fetcher/fetcher';
import * as sinon from 'sinon';
import { expect, describe, it } from 'vitest'

const url = 'http://characters.com';

const contents = `
  <html>
    <head>
      <title>Game of Thrones Characters</title>
    </head>
    <body>
      <ul>
        <li>
          <a href="http://characters.com/jonsnow" class="name">Jon Snow</a>
          <div data-profile style="background:red;background-image:url('http://images.com/jonsnow')">
          <span data-price='{\"amount\": 243}'>23423</span>
          <span data-size="56">123</span>
          <div class="description"> A cool dude </div>
          <ul>
            <li><strong>Stark</strong><em>Sansa</em></li>
            <li><strong>Stark</strong><em>Bran</em></li>
            <li><strong>Stark</strong><em>Arya</em></li>
          </ul>
        </li>
        <li>
          <a href="http://characters.com/nedstark" class="name">Ned Stark</a>
          <div data-profile style="background:red;background-image:url('http://images.com/nedstark')">
          <span data-price='{\"amount\": 14234}'>23423</span>
          <span data-size="5536">43543</span>
          <div class="description">Dies a lot </div>
          <ul>
            <li><strong>Stark</strong><em>Sansa</em></li>
            <li><strong>B</strong><em>Bobby</em></li>
            <li><strong>finger</strong><em>Little</em></li>
          </ul>
        </li>
      </ul>
      <script type="application/ld+json">whatever</script>
      <script type="application/ld+json">
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
                "amount": "12345 dollars"
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
                "amount": "6789 eur"
              }
            }
          ]
        }
      </script>
      <script type="application/json">{"first":"Han Solo"}</script>
    </body>
  </html>
`;

const page: ScrapedPage = {
  encoding: 'utf-8',
  contents,
  url,
};

class FakeFetcher {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  getPage() {
    return new Promise(resolve => {
      return resolve(page);
    });
  }
}

it('returns scraped data for a url and contract', () => {
  const contract = {
    itemSelector: 'body > ul > li',
    attributes: {
      name: { type: 'text', selector: '.name' },
      photo: {
        type: 'background-image',
        selector: '[data-profile]',
        attribute: 'style',
      },
      link: { type: 'link', selector: 'a', attribute: 'href' },
      price: {
        type: 'number',
        selector: '[data-price]',
        data: { name: 'price', key: 'amount' },
      },
      currency: {
        type: 'number',
        selector: '[any-price]',
        data: { name: 'price', key: 'currency' },
      },
      country: {
        type: 'number',
        selector: '[any-price]',
        data: { name: 'country' },
      },
      city: { type: 'text', selector: 'description', attribute: 'city' },
      size: { type: 'size', selector: '[data-size]', attribute: 'data-size' },
      description: { type: 'text', selector: '.description' },
      fullText: { type: 'text' },
      friends: {
        itemSelector: 'ul li',
        attributes: {
          firstName: { type: 'text', selector: 'em' },
          lastName: { type: 'text', selector: 'strong' },
        },
      },
    },
  };

  const scraper = new Scraper(url, contract);
  scraper.getFetcher = sinon.stub().returns(new FakeFetcher(url));

  const expectedData = [
    {
      name: 'Jon Snow',
      photo: 'http://images.com/jonsnow',
      link: 'http://characters.com/jonsnow',
      price: 243,
      currency: null,
      city: null,
      size: 56,
      description: 'A cool dude',
      fullText:
        'Jon Snow\n          \n          23423\n          123\n           A cool dude \n          \n            StarkSansa\n            StarkBran\n            StarkArya',
      friends: [
        { firstName: 'Sansa', lastName: 'Stark' },
        { firstName: 'Bran', lastName: 'Stark' },
        { firstName: 'Arya', lastName: 'Stark' },
      ],
    },
    {
      name: 'Ned Stark',
      photo: 'http://images.com/nedstark',
      link: 'http://characters.com/nedstark',
      price: 14234,
      currency: null,
      city: null,
      size: 5536,
      description: 'Dies a lot',
      fullText:
        'Ned Stark\n          \n          23423\n          43543\n          Dies a lot \n          \n            StarkSansa\n            BBobby\n            fingerLittle',
      friends: [
        { firstName: 'Sansa', lastName: 'Stark' },
        { firstName: 'Bobby', lastName: 'B' },
        { firstName: 'Little', lastName: 'finger' },
      ],
    },
  ];

  return scraper
    .scrapePage()
    .then(data => {
      expect(JSON.stringify(expectedData, null, 2)).toStrictEqual(
        JSON.stringify(data, null, 2),
      );
    })
    .catch(error => {
      throw error;
    });
});

it('scrapes a json schema script tag for a url and contract', () => {
  const contract = {
    scriptTagSelector: 'script[type="application/ld+json"]:eq(1)',
    itemSelector: 'characters',
    attributes: {
      name: { type: 'text', selector: 'name' },
      friends: {
        itemSelector: 'friends',
        attributes: {
          firstName: { type: 'text', selector: 'firstName' },
          lastName: { type: 'text', selector: 'lastName' },
        },
      },
      photo: { type: 'link', selector: 'photo' },
      price: { type: 'number', selector: 'price.amount' },
    },
  };

  const scraper = new Scraper(url, contract);
  const expectedData = [
    {
      name: 'Jon Snow',
      friends: [
        { firstName: 'Sansa', lastName: 'Stark' },
        { firstName: 'Bran', lastName: 'Stark' },
        { firstName: 'Arya', lastName: 'Stark' },
      ],
      photo: 'http://images.com/jonsnow',
      price: 12345,
    },
    {
      name: 'Ned Stark',
      friends: [
        { firstName: 'Sansa', lastName: 'Stark' },
        { firstName: 'Bobby', lastName: 'B' },
        { firstName: 'Little', lastName: 'finger' },
      ],
      photo: 'http://images.com/nedstark',
      price: 6789,
    },
  ];

  scraper.getFetcher = sinon.stub().returns(new FakeFetcher(url));

  return scraper
    .scrapePage()
    .then(data => {
      expect(JSON.stringify(expectedData, null, 2)).toEqual(
        JSON.stringify(data, null, 2),
      );
    })
    .catch(error => {
      throw error;
    });
});

it('scrapes raw html from a script tag', () => {
  const contract = {
    itemSelector: 'body',
    attributes: {
      names: {
        type: 'text',
        raw: true,
        selector: 'script[type="application/json"]',
      },
    },
  };

  const scraper = new Scraper(url, contract);
  const expectedData = [{ names: JSON.stringify({ first: 'Han Solo' }) }];

  scraper.getFetcher = sinon.stub().returns(new FakeFetcher(url));

  return scraper
    .scrapePage()
    .then(data => {
      expect(JSON.stringify(expectedData, null, 2)).toEqual(
        JSON.stringify(data, null, 2),
      );
    })
    .catch(error => {
      throw error;
    });
});

it('returns the scraped page object', () => {
  const contract = {
    itemSelector: 'body',
    attributes: {
      names: {
        type: 'text',
        raw: true,
        selector: 'script[type="application/json"]',
      },
    },
  };

  const scraper = new Scraper(url, contract);

  scraper.getFetcher = sinon.stub().returns(new FakeFetcher(url));

  return scraper
    .getPageContents()
    .then(data => {
      expect(data.page.encoding).toEqual('utf-8');
      expect(data.page.url).toEqual(url);
    })
    .catch(error => {
      throw error;
    });
});
