import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import SiteNavItem from "@/components/SiteNavItem.vue";
import frontDataBase from "../../../db.json";

const dummySiteMenuItems = frontDataBase["siteMenuItems"];
const dummySiteNavItemTitle = dummySiteMenuItems[0].title;

describe("SiteNavItem component:", () => {
  test("renders link's title in place of the slot outlet", () => {
    const wrapper = mount(SiteNavItem, {
      slots: { default: dummySiteNavItemTitle },
    });
    expect(wrapper.text()).toContain(dummySiteNavItemTitle);
  });
});
