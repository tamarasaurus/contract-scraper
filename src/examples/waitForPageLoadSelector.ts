import Scraper from '../../index';

const contract = {
  itemSelector: '.acheter-right .room',
  waitForPageLoadSelector: '.acheter-right .room',
  puppeteer: true,
  attributes: {
    name: {
      type: 'text',
      selector: '.title-wrap',
    },
    description: {
      type: 'text',
      selector: '.title-wrap',
    },
    price: {
      type: 'number',
      selector: '.card-top .card-right',
    },
    size: {
      type: 'size',
      selector: '.title-wrap',
    },
    link: {
      type: 'link',
      selector: '.title-wrap',
      attribute: 'href',
    },
    photo: {
      type: 'link',
      selector: 'img',
      attribute: 'src',
    },
  },
};

const scraper = new Scraper(
  'http://www.stephaneplazaimmobilier-nantesest.com/catalog/result_carto.php?action=update_search&map_polygone=&C_28=Vente&C_28_search=EGAL&C_28_type=UNIQUE&site-agence=&C_65_search=CONTIENT&C_65_type=TEXT&C_65=44+NANTES&C_65_temp=44+NANTES&cfamille_id=&C_33_search=COMPRIS&C_33_type=TEXT&C_33_MIN=&C_33_MAX=&C_30_search=INFERIEUR&C_30_type=NUMBER&C_30=&C_30_format_quick=',
  contract,
  null,
  {
    headless: false,
  },
);

scraper.scrapePage().then(data => {
  console.log(data);
});
