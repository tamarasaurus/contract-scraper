export interface Provider {
  getScrapedItems(): Promise<[]>;
}
