import PuppeteerFetcher from '../../../src/fetcher/puppeteer';
import * as sinon from 'sinon';
import * as assert from 'assert';

class FakePage {
  setUserAgent() { }
  setExtraHTTPHeaders() { }
  setViewport() { }
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
  close() { }
}

class FakeBrowser {
  newPage() {
    return new FakePage();
  }
  close() { }
}

class FakePuppeteer {
  launch() {
    return new FakeBrowser();
  }
  getContents() {
    return {
      response: '',
      contents: '',
    };
  }
}

const puppeteerFetcher = new PuppeteerFetcher('http://leboncoin.com');
puppeteerFetcher.getBrowserType = sinon.stub().returns(new FakePuppeteer());

describe('it fetches data from puppeteer', () => {
  it('sets up the browser', async () => {
    const { page, browser } = await puppeteerFetcher.setupBrowser();
    const { response, contents } = await puppeteerFetcher.getContents(page, browser);

    assert.equal(
      JSON.stringify({ response, contents }, null, 2),
      JSON.stringify({ response: { headers: () => { } }, contents: '<html></html>' }, null, 2),
    );
  });

  it('gets page contents from the browser page', async () => {
    const page = await puppeteerFetcher.getPage();

    assert.equal(
      JSON.stringify(page),
      JSON.stringify({
        contents: '<html></html>',
        encoding: 'utf-8',
        url: 'http://leboncoin.com',
      }),
    );
  });
});
