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

export interface CommentBar {
  title: string;
  text: string;
  image: CommentBarImage;
}

export interface CommentBarImage {
  url: string;
  alt: string;
}

export const commentBarURL: string =
  "http://localhost:3001/componentCommentBar";

// CollectionListing

export interface CollectionListing {
  title: string;
  collections: Collection[];
}

export interface Collection {
  image: string;
  title: string;
  url: string;
}

export const collectionListURL: string =
  "http://localhost:3001/componentCollectionListing";
