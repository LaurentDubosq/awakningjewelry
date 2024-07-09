import { mount } from "@vue/test-utils";
import SiteNavDropdownItem from "@/components/SiteNavDropdownItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const title = siteMenuItems[1].subMenuItems[0].title;

describe("SiteNavDropdownItem component:", () => {
  test("renders its title", () => {
    const wrapper = mount(SiteNavDropdownItem, {
      slots: { default: title },
    });
    expect(wrapper.text()).toContain(title);
  });
});
