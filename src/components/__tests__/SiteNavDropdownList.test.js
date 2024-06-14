import { mount } from "@vue/test-utils";
import { describe, test, expect, beforeEach } from "vitest";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue";
import SiteNavDropdownItem from "@/components/SiteNavDropdownItem.vue";
import frontDataBase from "../../../db.json";

const dummySiteMenuItems = frontDataBase["siteMenuItems"];
const dummyDropdownList = dummySiteMenuItems[1].subMenuItems;

describe("SiteNavDropdownList component:", () => {
  let wrapper;
  let listItemElements;

  beforeEach(() => {
    wrapper = mount(SiteNavDropdownList, {
      props: { items: dummyDropdownList },
    });
    listItemElements = wrapper.findAll(".site-nav__dropdown-list-item");
  });

  test("renders its entire list", () => {
    expect(listItemElements).toHaveLength(dummyDropdownList.length);
  });

  describe("Each item:", () => {
    test("renders its link URL", () => {
      // Tested on all items - because of critical component
      listItemElements.forEach((listItemElement, i) => {
        const linkElement = listItemElement.find(
          "[data-testclass='site-nav__dropdown-list-item-link']"
        );
        expect(linkElement.attributes("to")).toContain(
          dummyDropdownList[i].url
        );
      });
    });

    test("renders its link title", () => {
      // Tested on all items - because of critical component
      listItemElements.forEach((listItemElement, i) => {
        const SiteNavDropdownItemComponent =
          listItemElement.findComponent(SiteNavDropdownItem);
        expect(SiteNavDropdownItemComponent.text()).toContain(
          dummyDropdownList[i].title
        );
      });
    });

    test("has their title wrapped by a link", () => {
      // Additional test - because of critical component
      listItemElements.forEach((listItemElement, i) => {
        const linkElement = listItemElement.find(
          "[data-testclass='site-nav__dropdown-list-item-link']"
        );
        expect(linkElement.exists()).toBe(true);
        expect(linkElement.html()).toContain(dummyDropdownList[i].title);
      });
    });

    test("emits its custom event when it is clicked", async () => {
      // Due to the inability to clear the component's emitted() array we only test the first link
      const firstListItemElement = listItemElements[0];
      await firstListItemElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("close-dropdown");
    });
  });
});
