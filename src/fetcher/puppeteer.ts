import Fetcher from './fetcher';
import { ScrapedPage } from '../fetcher/fetcher';
import randomUserAgent from 'random-useragent';
import puppeteer, { HTTPResponse, PuppeteerNodeLaunchOptions } from 'puppeteer';
import { getContentTypeHeaders, guessEncoding } from '../tools/encoding';

export default class PuppeteerFetcher implements Fetcher {
  private url: string;
  private waitForPageLoadSelector: string;
  private options: PuppeteerNodeLaunchOptions;

  constructor(
    url: string,
    waitForPageLoadSelector?: string,
    options?: PuppeteerNodeLaunchOptions,
  ) {
    this.url = url;
    this.waitForPageLoadSelector = waitForPageLoadSelector;
    this.options = options || { headless: true };
  }

  public getBrowserType() {
    return puppeteer;
  }

  public async setupBrowser(): Promise<{
    response: HTTPResponse;
    contents: string;
  }> {
    const browserType = this.getBrowserType();
    const userAgent = randomUserAgent.getRandom();
    const browser = await browserType.launch({
      headless: this.options.headless,
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
