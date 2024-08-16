import { pagesMetaDataUrl, type PageMetaData } from "@/data/seo";
import { siteMenuItemsUrl, type SiteMenuItem } from "@/data/menus";
import {
  collectionListingURL,
  commentBarURL,
  heroSlidesURL,
  productListingPromotionsURL,
  type CollectionListing,
  type CommentBar,
  type HeroSlideType,
  type ProductListing,
} from "@/data/components";

export const useFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T | undefined> => {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return data as T;
    } else {
      const errorMessage = `${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      console.log(
        "Network error: Please check your internet connection or the request URL."
      );
    } else {
      console.log("Error encountered after the Fetch execution :", error);
    }
  }
};

export const getPagesMetaData = async (): Promise<
  PageMetaData[] | undefined
> => {
  const data: PageMetaData[] | undefined = await useFetch(pagesMetaDataUrl);
  return data;
};

export const getSiteMenuItems = async (): Promise<
  SiteMenuItem[] | undefined
> => {
  const data: SiteMenuItem[] | undefined = await useFetch(siteMenuItemsUrl);
  return data;
};

export const getHeroSlides = async (): Promise<HeroSlideType[] | undefined> => {
  const data: HeroSlideType[] | undefined = await useFetch(heroSlidesURL);
  return data;
};

export const getCommentBar = async (): Promise<CommentBar | undefined> => {
  const data: CommentBar | undefined = await useFetch(commentBarURL);
  return data;
};

export const getCollectionListingGender = async (): Promise<
  CollectionListing | undefined
> => {
  const data: CollectionListing | undefined = await useFetch(
    collectionListingURL
  );
  return data;
};

export const getProductListingPromotions = async (): Promise<
  ProductListing | undefined
> => {
  const data: ProductListing | undefined = await useFetch(
    productListingPromotionsURL
  );
  return data;
};
