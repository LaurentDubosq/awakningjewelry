// Collection

export interface Collection {
  image: string;
  title: string;
  url: string;
}

// Product

export interface Product {
  title: string;
  image: ProductImage;
  price: string;
  promotionalPrice: string;
  url: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}
