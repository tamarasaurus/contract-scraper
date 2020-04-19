import * as assert from 'assert';
import Scraper from '../../index';
import PuppeteerFetcher from '../../src/fetcher/puppeteer';
import { ScrapedPage } from '../../src/fetcher/fetcher';
import HTMLProvider from '../../src/provider/html';
import * as sinon from 'sinon';

const contract = {
  itemSelector: 'li[itemtype=\http://schema.org/Offer\]',
  attributes: {
    name: { type: 'text', selector: '[itemprop=\name\]' },
    price: { type: 'number', selector: '[itemprop=\price\]' },
  },
};

describe('Scrapes a URL based on JSON configuration', () => {
  it('validates a JSON contract', () => {
    const scraper = new Scraper(
      'https://www.leboncoin.fr/annonces/offres/pays_de_la_loire/',
      null,
    );

    assert.throws(
      () => scraper.scrapePage(),
      new Error('Your contract is invalid, please check the specifications'),
    );
  });

  it('validates a url', () => {
    const scraper = new Scraper('an invalid url', {});

    assert.throws(
      () => scraper.scrapePage(),
      new Error('The URL "an invalid url" you have provided is invalid'),
    );
  });

  it('merges custom attribute types from the user', () => {
    function Special(inputValue: string) {
      return inputValue;
    }

    const customAttributeTypes = { special: Special };
    const defaultAttributeTypes = { name: () => 'test' };

    const scraper = new Scraper(
      'https://www.leboncoin.fr/annonces/offres/pays_de_la_loire/',
      contract,
      customAttributeTypes,
    );

    scraper.defaultAttributes = defaultAttributeTypes;

    assert.equal(
      scraper.getAttributes(),
      Object.assign(defaultAttributeTypes, customAttributeTypes),
    );
  });

  it('gets the html provider', () => {
    const url = 'https://google.com';
    const scraper = new Scraper(url, contract);
    const page: ScrapedPage = {
      url,
      encoding: 'utf-8',
      contents: '',
    };

    const attributes = scraper.getAttributes();

    assert.equal(
      JSON.stringify(scraper.getProvider(page, attributes)),
      JSON.stringify(new HTMLProvider(page, contract, attributes)),
    );
  });

  it('gets the fetcher', () => {
    const url = 'https://google.com';
    const scraper = new Scraper(url, contract);
    const page: ScrapedPage = {
      url,
      encoding: 'utf-8',
      contents: '',
    };

    const attributes = scraper.getAttributes();

    assert.equal(
      JSON.stringify(scraper.getFetcher()),
      JSON.stringify(new PuppeteerFetcher(url)),
    );
  })

  it('returns scraped data from a url', () => {
    const scraper = new Scraper('http://leboncoin.com', contract);
    const expectedData = [{ name: 'House listing', price: 375000 }];

    class ProviderStub {
      getScrapedItems() {
        return expectedData;
      }
    }

    class FakeFetcher {
      private url: string;

      constructor(url: string) {
        this.url = url;
      }

      getPage() {
        return new Promise((resolve) => {
          return resolve({
            contents: '<html></html>',
            url: 'http://leboncoin.com',
          });
        });
      }
    }

    scraper.getFetcher = sinon.stub().returns(new FakeFetcher('http://leboncoin.com'));
    scraper.getProvider = sinon.stub().returns(new ProviderStub());

    return scraper.scrapePage().then((data) => {
      assert.equal(
        JSON.stringify(data),
        JSON.stringify(expectedData),
      );
    }).catch((error) => { throw error; });
  });
});
