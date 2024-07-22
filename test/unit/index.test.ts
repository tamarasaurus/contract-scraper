import Scraper from '../../index';
import PuppeteerFetcher from '../../src/fetcher/puppeteer';
import { ScrapedPage } from '../../src/fetcher/fetcher';
import HTMLProvider from '../../src/provider/html';
import * as sinon from 'sinon';
import RequestFetcher from '../../src/fetcher/request';
import { expect, describe, it, beforeEach } from 'vitest'

const contract = {
  itemSelector: 'li[itemtype=http://schema.org/Offer]',
  attributes: {
    name: { type: 'text', selector: '[itemprop=\name]' },
    price: { type: 'number', selector: '[itemprop=price]' },
  },
};

describe('Scrapes a URL based on JSON configuration', () => {
  let testContext: any;

  beforeEach(() => {
    testContext = {};
  });

  it('validates a JSON contract', () => {
    const scraper = new Scraper(
      'https://www.leboncoin.fr/annonces/offres/pays_de_la_loire/',
      null,
    );

    expect(() => scraper.scrapePage()).toThrowError(
      'Your contract is invalid, please check the specifications',
    );
  });

  it('validates a url', () => {
    const scraper = new Scraper('an invalid url', {});

    expect(() => scraper.scrapePage()).toThrowError(
      'The URL "an invalid url" you have provided is invalid',
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

    expect(scraper.getAttributes()).toEqual(
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

    expect(JSON.stringify(scraper.getProvider(page, attributes))).toEqual(
      JSON.stringify(new HTMLProvider(page, contract, attributes)),
    );
  });

  it('gets the fetcher', () => {
    const requestScraper = new Scraper('https://google.com', contract);
    expect(requestScraper.getFetcher()).toBeInstanceOf(RequestFetcher);

    const puppeteerScraper = new Scraper('https://google.com', {
      ...contract,
      puppeteer: true,
    });
    expect(puppeteerScraper.getFetcher()).toBeInstanceOf(PuppeteerFetcher);
  });

  it('returns scraped data from a url', () => {
    const scraper = new Scraper('http://leboncoin.com', contract);
    const expectedData = [{ name: 'House listing', price: 375000 }];

    class ProviderStub {
      getScrapedItems() {
        return expectedData;
      }
    }

    class FakeFetcher {
      public url: string;

      constructor(url: string) {
        testContext.url = url;
      }

      getPage() {
        return new Promise(resolve => {
          return resolve({
            contents: '<html></html>',
            url: 'http://leboncoin.com',
          });
        });
      }
    }

    scraper.getFetcher = sinon
      .stub()
      .returns(new FakeFetcher('http://leboncoin.com'));
    scraper.getProvider = sinon.stub().returns(new ProviderStub());

    return scraper
      .scrapePage()
      .then(data => {
        expect(JSON.stringify(data)).toEqual(JSON.stringify(expectedData));
      })
      .catch(error => {
        throw error;
      });
  });
});
