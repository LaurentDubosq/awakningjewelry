import { mount } from "@vue/test-utils";
import SiteNavDropdown from "@/components/SiteNavDropdown.vue";
import SiteNavDropdownHeader from "@/components/SiteNavDropdownHeader.vue";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const dropdown = siteMenuItems[1];

describe("SiteNavDropdown component:", () => {
  let wrapper;
  let SiteNavDropdownHeaderComponent;

  beforeEach(() => {
    wrapper = mount(SiteNavDropdown, {
      props: { dropdown: dropdown },
      global: {
        stubs: {
          SiteNavDropdownHeader,
          SiteNavDropdownList,
        },
      },
    });
    SiteNavDropdownHeaderComponent = wrapper.findComponent(
      SiteNavDropdownHeader
    );
  });

  describe("SiteNavDropdownHeader component:", () => {
    test("is rendered", () => {
      expect(SiteNavDropdownHeaderComponent.exists()).toBe(true);
    });

    test("renders its title", () => {
      expect(SiteNavDropdownHeaderComponent.text()).toContain(dropdown.title);
    });

    test("receives the 'false' value for the 'isDropdownOpen' prop at initial render", () => {
      expect(SiteNavDropdownHeaderComponent.props("isDropdownOpen")).toBe(
        false
      );
    });

    test("receives the 'true' value for the 'isDropdownOpen' prop when mouse enter the header", async () => {
      // Open the dropdown
      await wrapper.trigger("mouseenter");

      // Assert the 'isDropdownOpen' prop has been toggled to 'true'
      expect(SiteNavDropdownHeaderComponent.props("isDropdownOpen")).toBe(true);
    });
  });

  describe("SiteNavDropdownList component:", () => {
    test("don't renders at initial render", () => {
      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);
      expect(SiteNavDropdownListComponent.exists()).toBe(false);
    });

    test("is rendered when the mouse enter the dropdown header and receives the expected value for the 'items' prop", async () => {
      // Open the dropdown
      await wrapper.trigger("mouseenter");

      // Assert the dropdown list component is rendered
      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);
      expect(SiteNavDropdownListComponent.exists()).toBe(true);

      // Assert the dropdown list component contains the "items" prop with the expected value
      expect(SiteNavDropdownListComponent.props("items")).toMatchObject(
        dropdown.subMenuItems
      );
    });

    test("don't renders when the mouse leaves the dropdown", async () => {
      // Open the dropdown
      await wrapper.trigger("mouseenter");

      // Close the dropdown
      await wrapper.trigger("mouseleave");

      // Assert the dropdown list is not rendered
      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);
      expect(SiteNavDropdownListComponent.exists()).toBe(false);
    });

    test("don't renders when a dropdown item has been clicked", async () => {
      // Open the dropdown
      await wrapper.trigger("mouseenter");

      // Click on dropdown item
      const firstListItemLinkElement = wrapper.find(
        "[data-testid='site-nav__dropdown-list-item-link']"
      );
      await firstListItemLinkElement.trigger("click");

      // Assert the dropdown list is not rendered
      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);
      expect(SiteNavDropdownListComponent.exists()).toBe(false);
    });
  });
});
