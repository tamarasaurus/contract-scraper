import Fetcher from './fetcher';
import { ScrapedPage } from '../fetcher/fetcher';
import randomUserAgent from 'random-useragent';
import puppeteer from 'puppeteer';
import { getContentTypeHeaders, guessEncoding } from '../tools/encoding';

export default class PuppeteerFetcher implements Fetcher {
  private url: string;

  constructor(url) {
    this.url = url;
  }

  public getBrowserType() {
    return puppeteer;
  }

  public async setupBrowser(): Promise<{ page: puppeteer.Page, browser: puppeteer.Browser }> {
    const browserType = this.getBrowserType();
    const browser = await browserType.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-insecure'],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    const userAgent = randomUserAgent.getRandom();

    await page.setUserAgent(userAgent);
    await page.setExtraHTTPHeaders({
      'Content-Type': 'text/html; charset=utf-8',
      'Accept': 'text/html',
      'Accept-Language': 'fr-FR',
    });

    await page.setViewport({ width: 1280, height: 1000 });

    return { page, browser };
  }

  public async getContents(page, browser): Promise<{ response: puppeteer.Response, contents: string }> {
    try {
      const response = await page.goto(this.url);
      const contents = await page.content();

      await page.close();
      await browser.close();

      return { response, contents };
    } catch (e) {
      await page.close();
      await browser.close();

      console.log(`Error fetching ${this.url} with puppeteer`);
      throw e;
    }
  }

  async getPage(): Promise<ScrapedPage> {
    const { page, browser } = await this.setupBrowser();
    const { response, contents } = await this.getContents(page, browser);
    const contentType = getContentTypeHeaders(await response.headers());

    return {
      contents,
      encoding: guessEncoding(contentType, contents),
      url: this.url,
    };
  }
}
