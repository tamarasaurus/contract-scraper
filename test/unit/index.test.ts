import * as assert from 'assert';
import Scraper from '../../index';

const contract = {
  itemSelector: 'li[itemtype=\http://schema.org/Offer\]',
  pageQuery: 'page',
  load: true,
  attributes: {
    name: { type: 'text', selector: '[itemprop=\name\]' },
    price: { type: 'price', selector: '[itemprop=\price\]' },
    description: { type: 'text', selector: '[itemprop=\availableAtOrFrom\]' },
    size: { type: 'size', selector: '[itemprop=\name\]' },
    link: { type: 'link', selector: '> a', attribute: 'href' },
    photo: { type: 'link', selector: 'img', attribute: 'src' },
  },
};

function Special(inputValue: string) {
  this.value = inputValue;

  return this.value;
}

describe('Scrapes a URL based on JSON configuration', () => {
  it('validates a JSON contract', () => {
    const scraper = new Scraper(
      'https://www.leboncoin.fr/annonces/offres/pays_de_la_loire/',
      null,
    );

    assert.throws(
      () => scraper.scrape(),
      new Error('Your contract is invalid, please check the specifications'),
    );
  });

  it('merges custom attribute types from the user', () => {
    const customAttributeTypes =  {
      special: Special,
    };

    const defaultAttributeTypes = {
      name: () => 'test',
    };

    const scrape = new Scraper(
      'https://www.leboncoin.fr/annonces/offres/pays_de_la_loire/',
      contract,
      customAttributeTypes,
    );

    scrape.defaultAttributeTypes = defaultAttributeTypes;

    assert.equal(
      scrape.getAttributeTypes(),
      Object.assign(defaultAttributeTypes, customAttributeTypes),
    );
  });

  it('sets scraping options based on a valid JSON contract');
  it('scrapes a URL and returns an array of scraped items');
  it('decides which fetcher to use based on contract configuration');
  it('decides which provider to use based on the request content type');
  it('fetches HTML page contents as a string');
  it('provides scraped items from page contents');
});
