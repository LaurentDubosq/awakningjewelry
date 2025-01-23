import { mount } from "@vue/test-utils";
import BurgerMenuDropdownItem from "@/components/BurgerMenuDropdownItem.vue";
import router from "@/router";
import { toggleBurgerMenuKey } from "@/utils/injectionkeys";
import frontDataBase from "../../../db.json";

const mockSiteMenu = frontDataBase["siteMenu"];
const mockLink = mockSiteMenu[1].subMenu[0];
const mockLinkText = mockSiteMenu[1].subMenu[0].text;
const mockLinkURL = mockSiteMenu[1].subMenu[0].url;
const mockToggleBurgerMenu = vi.fn();

// Mock the fetcher used in the mocked router
vi.mock("@/data/dataFetchers", () => {
  return {
    getPagesMetaData: vi.fn().mockReturnValue(undefined),
  };
});

// Component Factory
function mountBurgerMenuDropdownItem(propsOptions = {}) {
  return mount(BurgerMenuDropdownItem, {
    props: { link: mockLink, ...propsOptions },
    global: {
      plugins: [router],
      provide: { [toggleBurgerMenuKey]: mockToggleBurgerMenu },
    },
  });
}

describe("BurgerMenuDropdownItem.vue", () => {
  let wrapper;
  let link;

  beforeEach(() => {
    wrapper = mountBurgerMenuDropdownItem();
    link = wrapper.find("[data-testid='burger-menu__dropdown-item-link']");
  });

  // Smoke test
  test("mounts successfully", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test("renders the link with necessary information", () => {
    // Assert the link is rendered
    expect(link.exists()).toBeTruthy();

    // Assert the link has the correct url
    expect(link.attributes("href")).toContain(mockLinkURL);

    // Assert the link's text is well rendered
    expect(link.text()).toContain(mockLinkText);
  });

  describe("Behaviors:", () => {
    test("when the link is touched, it commands the dropdown to close", async () => {
      // Touch the link
      await link.trigger("click");

      // Assert the open/close dropdown function has been triggered
      expect(mockToggleBurgerMenu).toHaveBeenCalledTimes(1);
    });
  });
});
