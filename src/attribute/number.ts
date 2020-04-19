export default (number: string) => {
  if (number === undefined || number === null) {
    return null;
  }

  const strippedString = number.toString().replace(/\s+/g, '');
  const getValue = /\d+/gm;
  const parsedString = strippedString.match(getValue);

  if (parsedString === null || parsedString.length === 0) {
    return null;
  }

  return parseInt(parsedString[0], 10);
};
