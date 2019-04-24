export interface Page {
  encoding: string;
  contents: string;
}

export default interface Fetcher {
  getPage(): Promise<Page>;
}
