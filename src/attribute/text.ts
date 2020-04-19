export default (inputValue: string) => {
  if (
    inputValue === undefined ||
    inputValue === null ||
    inputValue.trim().length === 0
  ) {
    return null;
  }

  return inputValue.trim();
};
