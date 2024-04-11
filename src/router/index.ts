import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Innovante Buddhist Jewelry Brand - AwakningJewelry.com",
        description:
          "Draw energy from your Eastern values to live your spirituality and find well-being in our Western world by wearing our Bracelets tailored to your dress codes &amp; 108 Malas Beads adapted to your Meditation &amp; Yoga sessions.",
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
