import PuppeteerFetcher from '../../../src/fetcher/puppeteer';
import * as sinon from 'sinon';
import { expect, describe, it } from 'vitest'

class FakePage {
  setUserAgent() {}
  setExtraHTTPHeaders() {}
  setViewport() {}
  goto() {
    return {
      headers: () => {
        return {
          'content-type': 'application/json;charset=utf-8',
        };
      },
    };
  }
  content() {
    return '<html></html>';
  }
  close() {}
}

class FakeBrowser {
  newPage() {
    return new FakePage();
  }
  close() {}
}

class FakePuppeteer {
  launch() {
    return new FakeBrowser();
  }
}

const puppeteerFetcher = new PuppeteerFetcher('http://leboncoin.com');
puppeteerFetcher.getBrowserType = sinon.stub().returns(new FakePuppeteer());

describe('it fetches data from puppeteer', () => {
  it('sets up the browser', async () => {
    const { response, contents } = await puppeteerFetcher.setupBrowser();

    expect(JSON.stringify({ response, contents }, null, 2)).toEqual(
      JSON.stringify(
        { response: { headers: () => {} }, contents: '<html></html>' },
        null,
        2,
      ),
    );
  });

  it('gets page contents from the browser page', async () => {
    const page = await puppeteerFetcher.getPage();

    expect(JSON.stringify(page)).toEqual(
      JSON.stringify({
        contents: '<html></html>',
        encoding: 'utf-8',
        url: 'http://leboncoin.com',
      }),
    );
  });
});
