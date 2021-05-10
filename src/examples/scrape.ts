import Scraper from '../../index'

const contract = {
  itemSelector: '[class*="RecipesGrid"] [class*="RecipeItem"]',
  puppeteer: true,
  attributes: {
    photo: {
      type: 'link',
      selector: 'img',
      attribute: 'src'
    },
    link: {
      type: 'link',
      selector: 'a',
      attribute: 'href'
    },
    name: {
      type: 'text',
      selector: 'a'
    }
  }
}

const scraper = new Scraper(
  'https://www.quitoque.fr/recettes',
  contract
)

scraper.scrapePage().then(recipes => {
  console.log(recipes)
})