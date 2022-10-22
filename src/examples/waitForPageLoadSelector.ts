import Scraper from '../../index';

const contract = {
  itemSelector: '.blog-list .post-container',
  waitForPageLoadSelector: '.blog-list .post-container',
  puppeteer: true,
  attributes: {
    photo: {
      type: 'background-image',
      selector: '.sh-ratio-content',
      attribute: 'style',
    },
    link: {
      type: 'link',
      selector: 'a.post-overlay',
      attribute: 'href',
    },
    name: {
      type: 'text',
      selector: 'h2',
    },
  },
};

const scraper = new Scraper(
  'https://www.kazoart.com/blog/en/',
  contract,
  null,
  { headless: false },
);

scraper.scrapePage().then(data => {
  console.log(data);
});
