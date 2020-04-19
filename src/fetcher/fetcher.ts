export interface ScrapedPage {
  encoding: string;
  contents: string;
  url: string;
}

export default interface Fetcher {
  getPage(): Promise<ScrapedPage>;
}
