import * as sinon from 'sinon';
import RequestFetcher from '../../../src/fetcher/request';
import { expect, describe, it } from 'vitest'

class FakeRequest {
  get(options: any) {
    return new Promise(resolve => {
      resolve({
        data: `<html></html>`,
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
    request.getRequestLibrary = sinon.stub().returns(new FakeRequest());

    const expectedPage = {
      encoding: 'utf-8',
      contents: '<html></html>',
      url: 'http://whatever.com',
    };

    return request.getPage().then(page => {
      expect(JSON.stringify(expectedPage)).toEqual(JSON.stringify(page));
    });
  });
});
