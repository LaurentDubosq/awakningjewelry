import type { siteMenuItem } from "@/data/menus";

export const useFetch = async (
  url: string,
  options?: RequestInit
): Promise<siteMenuItem[] | undefined> => {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Erreur HTTP, statut :" + response.status);
    }
  } catch (error) {
    console.log("Erreur lors de la requete Fetch :" + error);
  }
};
