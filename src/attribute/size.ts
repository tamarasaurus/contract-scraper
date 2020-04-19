export default (size: string) => {
  if (size === undefined || size === null) {
    return null;
  }

  const sizeNumber = parseInt(size, 10);
  let parsedSize: number = sizeNumber;

  if (Number.isNaN(parsedSize)) {
    const regex = /^\d+|(\b\d+\s+|\d)+\s?(?=m2|M²|m²|m\s)/gm;
    const match = regex.exec(size);
    parsedSize =
      match && match[0] ? parseInt(match[0].replace(/\D/gm, ''), 10) : null;
  }

  return parsedSize;
};
