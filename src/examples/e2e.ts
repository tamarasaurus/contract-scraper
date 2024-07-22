import Scraper from '../../index';

const contract = {
  itemSelector: '.row .card',
  puppeteer: true,
  attributes: {
    photo: {
      type: 'link',
      selector: '.card-img-top',
      attribute: 'src',
    },
    link: {
      type: 'link',
      selector: 'a.title',
      attribute: 'href',
    },
    name: {
      type: 'text',
      selector: '.description',
    },
  },
};

const scraper = new Scraper(
  'https://webscraper.io/test-sites/e-commerce/allinone',
  contract,
);

scraper.scrapePage().then(recipes => {
  if (recipes.length === 0) {
    process.exit(1);
  } else {
    console.log('Scraped successfully');
  }
});
