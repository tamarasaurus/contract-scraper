import Scraper from '../../index';
import * as assert from 'assert';
import { Page } from '../../src/fetcher/fetcher';
import * as sinon from 'sinon';

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
        </li>
        <li>
          <a href="http://characters.com/nedstark" class="name">Ned Stark</a>
          <div data-profile style="background:red;background-image:url('http://images.com/nedstark')">
          <span data-price='{\"amount\": 14234}'>23423</span>
          <span data-size="5536">43543</span>
          <div class="description">Dies a lot </div>
        </li>
      </ul>
    </body>
  </html>
`;

const page: Page = {
  contents,
  url,
  encoding: 'en-US',
};

const contract = {
  itemSelector: 'ul li',
  scrapeAfterLoading: false,
  attributes: {
    name: { type: 'text', selector: '.name' },
    photo: { type: 'backgroundImage', selector: '[data-profile]', attribute: 'style' },
    link: { type: 'link', selector: 'a', attribute: 'href' },
    price: { type: 'price', selector: '[data-price]', data: { name: 'price', key: 'amount' } },
    size: { type: 'size', selector: '[data-size]', attribute: 'data-size' },
    description: { type: 'text', selector: '.description' },
  },
};

const expectedData = [
  {
    name: 'Jon Snow',
    photo: 'http://images.com/jonsnow',
    link: 'http://characters.com/jonsnow',
    price: 243,
    size: 56,
    description: 'A cool dude',
  },
  {
    name: 'Ned Stark',
    photo: 'http://images.com/nedstark',
    link: 'http://characters.com/nedstark',
    price: 14234,
    size: 5536,
    description: 'Dies a lot',
  },
];

class FakeFetcher {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  getPage() {
    return new Promise((resolve) => {
      return resolve(page);
    });
  }
}

it('returns scraped data for a url and contract', () => {
  const scraper = new Scraper(url, contract);
  scraper.getFetcher = sinon.stub().returns(new FakeFetcher(url));

  return scraper.getDataFromPage().then((data) => {
    assert.equal(
      JSON.stringify(expectedData, null, 2),
      JSON.stringify(data, null, 2),
    );
  }).catch((error) => { throw error; });
});
