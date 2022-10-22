
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;

function isAbsolute(url) {
	if (WINDOWS_PATH_REGEX.test(url)) {
		return false;
	}

	return ABSOLUTE_URL_REGEX.test(url);
}

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

    if (!isAbsolute(match)) {
      return new URL(match, base.origin).href;
    }

    return match;
  } catch (e) {
    return null;
  }
};
