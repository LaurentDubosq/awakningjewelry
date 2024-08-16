import type { Collection, Product } from "./global.d.ts";

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

export interface CollectionListingData {
  title: string;
  collections: Collection[];
}

export const collectionListingGenderDataURL: string =
  "http://localhost:3001/collectionListingGenderData";

// ProductListing

export interface ProductListingData {
  title: string;
  products: Product[];
}

export const productListingPromotionsDataURL: string =
  "http://localhost:3001/productListingPromotionsData";
