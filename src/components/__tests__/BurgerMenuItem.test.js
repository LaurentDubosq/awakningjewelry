import { mount } from "@vue/test-utils";
import BurgerMenuItem from "@/components/BurgerMenuItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const title = siteMenuItems[0].title;

describe("BurgerMenuItem component:", () => {
  test("renders its title", () => {
    const wrapper = mount(BurgerMenuItem, {
      slots: { default: title },
    });
    expect(wrapper.text()).toContain(title);
  });
});
