import { pagesMetaDataUrl, type PageMetaData } from "@/data/seo";
import { siteMenuItemsUrl, type SiteMenuItem } from "@/data/menus";
import {
  collectionListingGenderDataURL,
  commentBarMissionDataURL,
  heroSlidesURL,
  productListingPromotionsDataURL,
  type CollectionListingData,
  type CommentBarData,
  type Slide,
  type ProductListingData,
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

export const getHeroSlides = async (): Promise<Slide[] | undefined> => {
  const data: Slide[] | undefined = await useFetch(heroSlidesURL);
  return data;
};

export const getCommentBarMissionData = async (): Promise<
  CommentBarData | undefined
> => {
  const data: CommentBarData | undefined = await useFetch(
    commentBarMissionDataURL
  );
  return data;
};

export const getCollectionListingGenderData = async (): Promise<
  CollectionListingData | undefined
> => {
  const data: CollectionListingData | undefined = await useFetch(
    collectionListingGenderDataURL
  );
  return data;
};

export const getProductListingPromotionsData = async (): Promise<
  ProductListingData | undefined
> => {
  const data: ProductListingData | undefined = await useFetch(
    productListingPromotionsDataURL
  );
  return data;
};
