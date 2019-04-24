export interface Page {
  encoding: string;
  contents: string;
  url: string;
}

export default interface Fetcher {
  getPage(): Promise<Page>;
}
