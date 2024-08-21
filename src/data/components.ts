import type { Collection, Product } from "./global.d.ts";

// SlideShow

export interface Slide {
  id: number;
  images: SlideImages;
  subtitle: string;
  title: string;
  url: string;
}

export interface SlideImages {
  mobile: string;
  desktop: string;
  alt: string;
}

export const heroSlidesURL: string = "http://localhost:3001/heroSlides";

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

export const commentBarMissionDataURL: string =
  "http://localhost:3001/commentBarMissionData";

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
