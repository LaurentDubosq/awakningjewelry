import { mount } from "@vue/test-utils";
import SiteNavItem from "@/components/SiteNavItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const title = siteMenuItems[0].title;

describe("SiteNavItem component:", () => {
  test("renders its title", () => {
    const wrapper = mount(SiteNavItem, {
      slots: { default: title },
    });
    expect(wrapper.text()).toContain(title);
  });
});
