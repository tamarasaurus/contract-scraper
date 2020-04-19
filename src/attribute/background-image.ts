import * as url from 'url';
import isRelativeUrl from 'is-relative-url';

export default (inputValue: string, rootUrl: string) => {
  const isEmpty = (style: string): boolean => {
    return style === undefined || style === null || style.trim().length === 0;
  };

  if (isEmpty(inputValue)) {
    return null;
  }

  try {
    const base = new URL(rootUrl);
    const image = /(background-image:\s?url\((.*)?)\)/.exec(inputValue);
    const match = image[2].replace(/'|"/g, '');

    if (isRelativeUrl(match)) {
      return url.resolve(base.origin, match);
    }

    return match;
  } catch (e) {
    return null;
  }
};
