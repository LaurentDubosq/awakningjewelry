import { mount } from "@vue/test-utils";
import BurgerMenuDropdownItem from "@/components/BurgerMenuDropdownItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const title = siteMenuItems[1].subMenuItems[0].title;

describe("BurgerMenuDropdownItem component:", () => {
  test("renders its title", () => {
    const wrapper = mount(BurgerMenuDropdownItem, {
      slots: { default: title },
    });
    expect(wrapper.text()).toContain(title);
  });
});
