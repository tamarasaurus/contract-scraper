import * as assert from 'assert'
import scrape from '../../index'

describe('Scrapes a URL based on JSON configuration', () => {
    it('validates a JSON contract', () => {
        assert.notStrictEqual(scrape(), []);
    });
    it('sets scraping options based on a valid JSON contract');
    it('scrapes a URL and returns an array of scraped items');
});
