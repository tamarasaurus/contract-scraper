export interface ScrapedPage {
  contents: string;
  url: string;
}

export default interface Fetcher {
  getPage(): Promise<ScrapedPage>;
}
