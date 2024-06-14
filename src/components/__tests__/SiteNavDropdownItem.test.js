import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import SiteNavDropdownItem from "@/components/SiteNavDropdownItem.vue";
import frontDataBase from "../../../db.json";

const dummySiteMenuItems = frontDataBase["siteMenuItems"];
const dummyDropdownItemTitle = dummySiteMenuItems[1].subMenuItems[0].title;

describe("SiteNavDropdownItem component:", () => {
  test("renders link's title in place of the slot outlet", () => {
    const wrapper = mount(SiteNavDropdownItem, {
      slots: { default: dummyDropdownItemTitle },
    });

    expect(wrapper.text()).toContain(dummyDropdownItemTitle);
  });
});
