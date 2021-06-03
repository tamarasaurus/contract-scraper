import Fetcher from './fetcher';
import { ScrapedPage } from '../fetcher/fetcher';
import randomUserAgent from 'random-useragent';
import puppeteer from 'puppeteer';
import { getContentTypeHeaders, guessEncoding } from '../tools/encoding';

export default class PuppeteerFetcher implements Fetcher {
  private url: string;
  private waitForPageLoadSelector: string;
  private headless: boolean;

  constructor(url, waitForPageLoadSelector, headless = true) {
    this.url = url;
    this.waitForPageLoadSelector = waitForPageLoadSelector;
    this.headless = headless;
  }

  public getBrowserType() {
    return puppeteer;
  }

  public async setupBrowser(): Promise<{
    response: puppeteer.HTTPResponse;
    contents: string;
  }> {
    const browserType = this.getBrowserType();
    const userAgent = randomUserAgent.getRandom();
    const browser = await browserType.launch({
      headless: this.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--allow-insecure',
        '--disable-web-security',
      ],
      ignoreHTTPSErrors: true,
      slowMo: 10,
    });

    const page = await browser.newPage();

    try {
      await page.setUserAgent(userAgent);
      await page.setExtraHTTPHeaders({
        'Content-Type': 'text/html; charset=utf-8',
        Accept: 'text/html',
        'Accept-Language': 'fr-FR',
      });

      await page.setViewport({ width: 1280, height: 1000 });

      const response = await page.goto(this.url);

      if (this.waitForPageLoadSelector) {
        await page.waitForSelector(this.waitForPageLoadSelector);
      }

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
    const { response, contents } = await this.setupBrowser();

    const contentType = getContentTypeHeaders(await response.headers());

    return {
      contents,
      encoding: guessEncoding(contentType, contents),
      url: this.url,
    };
  }
}
