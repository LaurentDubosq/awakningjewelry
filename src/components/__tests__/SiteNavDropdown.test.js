import { mount } from "@vue/test-utils";
import { describe, test, expect, beforeEach } from "vitest";
import SiteNavDropdown from "@/components/SiteNavDropdown.vue";
import SiteNavDropdownHeader from "@/components/SiteNavDropdownHeader.vue";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue";
import frontDataBase from "../../../db.json";

const dummySiteMenuItems = frontDataBase["siteMenuItems"];
const dummyDropdown = dummySiteMenuItems[1];

describe("SiteNavDropdown component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SiteNavDropdown, {
      props: { dropdown: dummyDropdown },
    });
  });

  describe("SiteNavDropdownHeader component:", () => {
    test("receives the 'isDropdownOpen' prop value", () => {
      const SiteNavDropdownHeaderComponent = wrapper.findComponent(
        SiteNavDropdownHeader
      );
      expect(SiteNavDropdownHeaderComponent.props("isDropdownOpen")).toBe(
        false
      );
    });

    test("renders the dropdown title through the slot outlet", () => {
      const SiteNavDropdownHeaderComponent = wrapper.findComponent(
        SiteNavDropdownHeader
      );
      expect(SiteNavDropdownHeaderComponent.text()).toContain(
        dummyDropdown.title
      );
    });
  });

  describe("SiteNavDropdownList component:", () => {
    test("receives the 'items' prop value when rendered", async () => {
      await wrapper.trigger("mouseenter");

      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);

      expect(SiteNavDropdownListComponent.props("items")).toEqual(
        dummyDropdown.subMenuItems
      );
    });

    test("don't renders when the component receive a 'close-dropdown' emit", async () => {
      await wrapper.trigger("mouseenter");

      const firstListItemLinkElement = wrapper.find(
        "[data-testclass='site-nav__dropdown-list-item-link']"
      );

      await firstListItemLinkElement.trigger("click");

      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);

      expect(SiteNavDropdownListComponent.exists()).toBeFalsy();
    });

    test("don't renders when the mouse leaves the dropdown", async () => {
      await wrapper.trigger("mouseenter");

      // We don't have to check that the dropdown list is rendered because we already verified the correct execution of this behavior in the previous test

      await wrapper.trigger("mouseleave");

      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);

      expect(SiteNavDropdownListComponent.exists()).toBeFalsy();
    });
  });
});
