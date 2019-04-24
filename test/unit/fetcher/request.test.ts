import * as assert from 'assert';
import * as sinon from 'sinon';
import * as requestLibrary from 'request-promise';
import RequestFetcher from '../../../src/fetcher/request';

class FakeRequest {
  get(options: any) {
    return new Promise((resolve) => {
      resolve({
        body: `<html></html>`,
        headers: {
          'Content-Type': 'charset=utf-8',
        },
      });
    });
  }
}

describe('it gets page contents using request', () => {
  it('gets encoded page contents for a given url', () => {
    const request = new RequestFetcher('http://whatever.com');
    request.getRequestLibrary = sinon.stub().returns(new FakeRequest);

    const expectedPage = {
      encoding: 'utf-8',
      contents: '<html></html>',
      url: 'http://whatever.com',
    };

    return request.getPage().then((page) => {
      assert.equal(
        JSON.stringify(expectedPage),
        JSON.stringify(page),
      );
    });
  });
});
