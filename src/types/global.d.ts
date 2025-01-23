/* Collection */
export interface Collection {
  image: CollectionImage;
  title: string;
  url: string;
}

export interface CollectionImage {
  url: string;
  alt: string;
}

/* Product */
export interface ProductSummary {
  title: string;
  image: ProductSummaryImage;
  price: string;
  promotionalPrice: string;
  url: string;
}

export interface ProductSummaryImage {
  url: string;
  alt: string;
}
