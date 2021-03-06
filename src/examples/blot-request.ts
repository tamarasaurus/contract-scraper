import Scraper from '../../index';

const contract = {
  itemSelector: '.bloc_annonce_habitat',
  puppeteer: false,
  attributes: {
    name: { type: 'custom-text', selector: '.title_part1' },
    description: { type: 'text', selector: '.title_part2' },
    size: { type: 'size', selector: '.chiffres_cles span:nth-child(2) strong' },
    link: { type: 'link', selector: '.title_part1', attribute: 'href' },
    number: { type: 'number', selector: '.prix strong' },
    photo: { type: 'link', selector: '.visuel img', attribute: 'src' },
  },
};

function customText(inputValue) {
  return `${inputValue}-custom`;
}

const scraper = new Scraper(
  'https://www.blot-immobilier.fr/habitat/achat-location/immobilier/loire-atlantique/nantes/',
  contract,
  {
    'custom-text': customText,
  },
);

scraper.scrapePage().then((data) => {
  console.log(data);
});
