import router from "@/router";
import { mount } from "@vue/test-utils";
import { siteMenuKey } from "@/utils/injectionkeys";
import SiteNav from "@/components/SiteNav.vue";
import SiteNavLink from "@/components/SiteNavLink.vue";
import SiteNavDropdown from "@/components/SiteNavDropdown.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import frontDataBase from "../../../db.json";

const mockSiteMenuResult = {
  data: { value: frontDataBase["siteMenu"] },
  status: { value: "resolved" },
};
const mockSiteMenuData = mockSiteMenuResult.data.value;

// Mock the fetcher used in the mocked router logic
vi.mock("@/data/dataFetchers", () => {
  return {
    getPagesMetaData: vi.fn().mockReturnValue(undefined),
  };
});

// Component Factory
function mountSiteNav(status = "resolved") {
  return mount(SiteNav, {
    global: {
      provide: {
        [siteMenuKey]: { ...mockSiteMenuResult, status: { value: status } },
      },
      plugins: [router],
    },
  });
}

describe("SiteNav.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountSiteNav();
  });

  // Smoke test
  test("mounts successfully", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test("renders all the expected navigation items with necessary information", () => {
    // Assert that all the expected navigation items are rendered
    const items = wrapper.findAll("[data-testid='site-nav__item']");
    expect(items).toHaveLength(mockSiteMenuData.length);

    // Assert that each item is rendered with its necessary information
    items.forEach(async (item, index) => {
      // Utilities
      function isTextLink() {
        return item.find("[data-testid='site-nav__link--text']").exists();
      }
      function isIconLink() {
        return item.find("[data-testid='site-nav__link--icon']").exists();
      }
      function isDropdown() {
        return item.findComponent(SiteNavDropdown).exists();
      }

      if (isTextLink()) {
        const SiteNavLinkComponent = item.findComponent(SiteNavLink);
        const linkAnchor = item.find("[data-testid='site-nav__link--text']");
        const mockLink = mockSiteMenuData[index];
        const mockLinkText = mockLink.text;
        const mockLinkURL = mockLink.url;

        // Assert the SiteNavLink component is rendered
        expect(SiteNavLinkComponent.exists()).toBeTruthy();

        // Assert the component "link" prop has the correct value
        expect(SiteNavLinkComponent.props("link")).toMatchObject(mockLink);

        /*******************/
        /* SiteNavLink.vue */
        /*******************/

        // Assert the link exists
        expect(linkAnchor.exists()).toBeTruthy();

        // Assert the link tag has the correct url
        expect(linkAnchor.attributes("href")).toBe(mockLinkURL);

        // Assert the link's text is rendered
        expect(linkAnchor.text()).toContain(mockLinkText);
      } else if (isIconLink()) {
        const SiteNavLinkComponent = item.findComponent(SiteNavLink);
        const linkAnchor = item.find("[data-testid='site-nav__link--icon']");
        const linkAlternativeText = item.find(
          "[data-testid='site-header__icon-text']"
        );
        const linkSVG = item.find("svg");
        const mockLink = mockSiteMenuData[index];
        const mockLinkText = mockLink.text;
        const mockLinkURL = mockLink.url;

        // Assert the SiteNavLink component is rendered
        expect(SiteNavLinkComponent.exists()).toBeTruthy();

        // Assert the component "link" prop has the correct value
        expect(SiteNavLinkComponent.props("link")).toMatchObject(mockLink);

        /*******************/
        /* SiteNavLink.vue */
        /*******************/

        // Assert the link exists
        expect(linkAnchor.exists()).toBeTruthy();

        // Assert the link tag has the correct url
        expect(linkAnchor.attributes("href")).toBe(mockLinkURL);

        // Assert the link icon is rendered
        expect(linkSVG.exists()).toBeTruthy();

        // Assert the alternative link text is rendered (for screen readers and search engine robots)
        expect(linkAlternativeText.text()).toContain(mockLinkText);
      } else if (isDropdown()) {
        const SiteNavDropdownComponent = item.findComponent(SiteNavDropdown);
        const dropdown = item.find("[data-testid='site-nav__dropdown']");
        const dropdownButton = item.find(
          "[data-testid='site-nav__dropdown-button']"
        );
        const mockDropdown = mockSiteMenuData[index];
        const mockDropdownTitle = mockDropdown.text;
        const mockDropdownList = mockDropdown.subMenu;
        const mockDropdownListLength = mockDropdownList.length;

        // Assert the SiteNavDropdown component is rendered
        expect(SiteNavDropdownComponent.exists()).toBeTruthy();

        // Assert the component "dropdown" prop has the correct value
        expect(SiteNavDropdownComponent.props("dropdown")).toMatchObject(
          mockDropdown
        );

        /*****************************/
        /* SiteNavDropdownButton.vue */
        /*****************************/

        // Assert the dropdown button text is rendered
        expect(dropdownButton.text()).toContain(mockDropdownTitle);

        /***************************/
        /* SiteNavDropdownList.vue */
        /***************************/

        // Open the dropdown
        await dropdown.trigger("mouseenter");

        // Assert all the expected links are rendered
        const dropdownItems = item.findAll(
          "[data-testid='site-nav__dropdown-item']"
        );
        expect(dropdownItems).toHaveLength(mockDropdownListLength);

        /***************************/
        /* SiteNavDropdownItem.vue */
        /***************************/

        // Assert each link is rendered with its necessary information
        dropdownItems.forEach((item, index) => {
          const link = item.find(
            "[data-testid='site-nav__dropdown-item-link']"
          );
          const mockLink = mockDropdownList[index];
          const mockLinkText = mockLink.text;
          const mockLinkURL = mockLink.url;

          // Assert the link tag has the correct url
          expect(link.attributes("href")).toBe(mockLinkURL);

          // Assert the link's text is rendered
          expect(link.text()).toContain(mockLinkText);
        });
      }
    });
  });

  describe("Behaviors:", () => {
    test("when the data fetcher status is 'pending', the loading component is rendered", () => {
      // Remount the component with pending status active
      wrapper = mountSiteNav("pending");

      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent);
      expect(loadingComponent.exists()).toBeTruthy();
    });

    test("when the data fetcher status is 'resolved', its data is rendered", () => {
      // Assert that one of its pieces of data is rendered
      const firstItem = wrapper.find("[data-testid='site-nav__item']");
      expect(firstItem.exists()).toBeTruthy();
    });

    test("when the data fetcher status is 'rejected', the error component is rendered", () => {
      // Remount the component with rejected status active
      wrapper = mountSiteNav("rejected");

      // Assert the error component is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent);
      expect(errorComponent.exists()).toBeTruthy();
    });
  });
});
