import { createRouter, createWebHistory } from "vue-router";
import { getPagesMetaData } from "@/data/dataFetchers";
import type { PageMetaData } from "@/types/router";
import type { Routes } from "../types/router";

const pagesMetaData: PageMetaData[] | undefined = await getPagesMetaData();
const routes: Routes = {};

// Addition of Pages Meta Data for each route
if (pagesMetaData) {
  for (const page of pagesMetaData) {
    routes[page.name] = {
      title: page.title,
      description: page.description,
    };
  }
}

// Creation of the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        title: routes.home?.title,
        description: routes.home?.description,
      },
    },
    // Will match everything and put it under `route.params.pathMatch`
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

// Add Pages Meta data to each loaded page
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
