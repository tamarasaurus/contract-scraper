import * as path from 'path';
export default (link: string, root: string) => {
  if (link === undefined || link === null || link.trim().length === 0) {
    return null;
  }

  const url = new URL(root);

  if (!link.startsWith('http') && !link.startsWith('www')) {
    return `${url.protocol}//${path.join(url.host, link)}`;
  }

  return link.trim();
};
