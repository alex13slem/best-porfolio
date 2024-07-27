export type VariantStyles = 'bordered' | 'fill';

export interface StyleMapping {
  bordered: string;
  fill: string;
}

export interface VariantsCss {
  root: StyleMapping;
  text: StyleMapping;
  i: StyleMapping;
}
