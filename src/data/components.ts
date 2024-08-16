// Hero

export interface HeroSlideType {
  id: number;
  images: HeroSlideImages;
  subtitle: string;
  title: string;
  url: string;
}

export interface HeroSlideImages {
  mobile: string;
  desktop: string;
  alt: string;
}

export const heroSlidesURL: string =
  "http://localhost:3001/componentHeroSlides";

// CommentBar

export interface CommentBarData {
  title: string;
  text: string;
  image: CommentBarImage;
}

export interface CommentBarImage {
  url: string;
  alt: string;
}

export const commentBarDataURL: string = "http://localhost:3001/commentBarData";

// CollectionListing

export interface CollectionListing {
  title: string;
  collections: CollectionListingCollection[];
}

export interface CollectionListingCollection {
  image: string;
  title: string;
  url: string;
}

export const collectionListingURL: string =
  "http://localhost:3001/collectionListingGender";

// ProductListing

export interface ProductListing {
  title: string;
  products: ProductListingProduct[];
}

export interface ProductListingProduct {
  title: string;
  image: ProductListingProductImage;
  price: string;
  promotionalPrice: string;
  url: string;
}

export interface ProductListingProductImage {
  url: string;
  alt: string;
}

export const productListingPromotionsURL: string =
  "http://localhost:3001/productListingPromotions";
