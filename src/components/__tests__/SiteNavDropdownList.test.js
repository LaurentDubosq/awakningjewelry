import { mount } from "@vue/test-utils";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue";
import SiteNavDropdownItem from "@/components/SiteNavDropdownItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const dropdownList = siteMenuItems[1].subMenuItems;

describe("SiteNavDropdownList component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SiteNavDropdownList, {
      props: { items: dropdownList },
      global: {
        stubs: { SiteNavDropdownItem },
      },
    });
  });

  test("renders its list entirely", () => {
    const listItemElements = wrapper.findAll(
      "[data-testid='site-nav__dropdown-list-item']"
    );
    expect(listItemElements).toHaveLength(dropdownList.length);
  });

  describe("Item:", () => {
    test("renders its title and link URL", () => {
      // Assert the title is rendered
      const firstSiteNavDropdownItemComponent =
        wrapper.findComponent(SiteNavDropdownItem);
      expect(firstSiteNavDropdownItemComponent.text()).toContain(
        dropdownList[0].title
      );

      // Assert the link's URL is setted
      const firstLinkElement = wrapper.find(
        "[data-testid='site-nav__dropdown-list-item-link']"
      );
      expect(firstLinkElement.attributes("to")).toBe(dropdownList[0].url);
    });

    test("emits its custom event when it is clicked", async () => {
      const firstListItemElement = wrapper.find(
        "[data-testid='site-nav__dropdown-list-item']"
      );
      await firstListItemElement.trigger("click");
      expect(wrapper.emitted()).toHaveProperty("close-dropdown");
    });
  });
});
