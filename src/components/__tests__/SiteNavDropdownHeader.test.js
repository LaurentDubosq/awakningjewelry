import { mount } from "@vue/test-utils";
import { describe, test, expect, beforeEach } from "vitest";
import SiteNavDropdownHeader from "@/components/SiteNavDropdownHeader.vue";
import frontDataBase from "../../../db.json";

const dummySiteMenuItems = frontDataBase["siteMenuItems"];
const dummyDropdownTitle = dummySiteMenuItems[1].title;

describe("SiteNavDropdownHeader component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SiteNavDropdownHeader, {
      props: {
        isDropdownOpen: false,
      },
      slots: { default: dummyDropdownTitle },
    });
  });

  test("renders the title in place of the slot outlet", () => {
    expect(wrapper.text()).toContain(dummyDropdownTitle);
  });

  test("renders the '▼' icon when the dropdown is close", () => {
    expect(wrapper.text()).toContain("▼");
  });

  test("renders the '▲' icon when the dropdown is open", () => {
    wrapper = mount(SiteNavDropdownHeader, {
      props: {
        isDropdownOpen: true,
      },
      slots: { default: dummyDropdownTitle },
    });
    expect(wrapper.text()).toContain("▲");
  });

  test("apply 'site-nav__dropdown-header--hover' CSS class when the dropdown is open", () => {
    wrapper = mount(SiteNavDropdownHeader, {
      props: {
        isDropdownOpen: true,
      },
      slots: { default: dummyDropdownTitle },
    });
    expect(wrapper.classes("site-nav__dropdown-header--hover")).toBe(true);
  });
});
