import { mount } from "@vue/test-utils";
import SiteNavDropdownHeader from "@/components/SiteNavDropdownHeader.vue";
import frontDataBase from "../../../db.json";
import { describe } from "node:test";

const siteMenuItems = frontDataBase["siteMenuItems"];
const title = siteMenuItems[1].title;

describe("SiteNavDropdownHeader component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SiteNavDropdownHeader, {
      props: {
        isDropdownOpen: false,
      },
      slots: { default: title },
    });
  });

  test("renders its title", () => {
    expect(wrapper.text()).toContain(title);
  });

  describe("'site-nav__dropdown-header--hover' CSS:", () => {
    test("don't renders the CSS class at initial render", () => {
      expect(wrapper.classes("site-nav__dropdown-header--hover")).toBe(false);
    });

    test("renders the CSS class when the dropdown is open", () => {
      wrapper = mount(SiteNavDropdownHeader, {
        props: {
          isDropdownOpen: true,
        },
      });
      expect(wrapper.classes("site-nav__dropdown-header--hover")).toBe(true);
    });
  });

  describe("Icon:", () => {
    test("renders the '▼' icon when the dropdown is close", () => {
      expect(wrapper.text()).toContain("▼");
    });

    test("renders the '▲' icon when the dropdown is open", () => {
      wrapper = mount(SiteNavDropdownHeader, {
        props: {
          isDropdownOpen: true,
        },
      });
      expect(wrapper.text()).toContain("▲");
    });
  });
});
