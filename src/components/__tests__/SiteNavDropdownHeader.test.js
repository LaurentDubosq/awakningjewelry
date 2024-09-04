import { mount } from "@vue/test-utils";
import SiteNavDropdownHeader from "@/components/SiteNavDropdownHeader.vue";
import frontDataBase from "../../../db.json";

const dropdown = frontDataBase.siteMenuItems[1];
const title = dropdown.title;

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

  describe("'site-nav__dropdown-header--hover' CSS class:", () => {
    test("don't renders the CSS class when the dropdown is close/at initial render", () => {
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
    test("renders the '▼' icon when the dropdown is close/at initial render", () => {
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
