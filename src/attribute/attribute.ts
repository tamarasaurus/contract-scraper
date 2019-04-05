export interface Attribute {
  getValue (): string | number;
  normalize (value: any): string | number;
}
