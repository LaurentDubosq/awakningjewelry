import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useFetch } from "@/composables/fetch";
import { pagesMetaDataUrl } from "@/data/seo";
import type { PageMetaData } from "@/data/seo";
import type { Routes } from "./index.d";

const pagesMetaData: PageMetaData[] | undefined = await useFetch(
  pagesMetaDataUrl
);
const routes: Routes = {};
if (pagesMetaData) {
  for (const page of pagesMetaData) {
    routes[page.name] = {
      title: page.title,
      description: page.description,
    };
  }
}
export { pagesMetaData }; // exports the variable to the Vue application (site logo component for instance)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: routes.home.title,
        description: routes.home.description,
      },
    },
  ],
});

router.beforeEach((to, from) => {
  let metaDescriptionElement = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]'
  );

  if (to.meta.title) {
    document.title = String(to.meta.title);
  } else {
    document.title = "Innovante Buddhist Jewelry Brand - AwakningJewelry.com";
  }

  if (!metaDescriptionElement) {
    let metaElement = document.createElement("meta");
    metaElement.setAttribute("name", "description");
    metaElement.setAttribute("content", "");
    document.head.appendChild(metaElement);
    metaDescriptionElement = metaElement;
  }
  if (to.meta.description) {
    metaDescriptionElement.content = to.meta.description.toString();
  } else {
    metaDescriptionElement.content = "";
  }
});
export default router;
