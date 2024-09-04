import { mount } from "@vue/test-utils";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue";
import SiteNavDropdownItem from "@/components/SiteNavDropdownItem.vue";
import frontDataBase from "../../../db.json";

const siteMenuItems = frontDataBase["siteMenuItems"];
const dropdownList = siteMenuItems[1].subMenuItems;

describe("SiteNavDropdownList component:", () => {
  let wrapper;
  let SiteNavDropdownItemComponents;
  let listItemElements;

  beforeEach(() => {
    wrapper = mount(SiteNavDropdownList, {
      props: { items: dropdownList },
      global: {
        stubs: { SiteNavDropdownItem },
      },
    });
    SiteNavDropdownItemComponents =
      wrapper.findAllComponents(SiteNavDropdownItem);
    listItemElements = wrapper.findAll(
      "[data-testid='site-nav__dropdown-list-item']"
    );
  });

  test("renders its list entirely", () => {
    expect(listItemElements).toHaveLength(dropdownList.length);
  });

  describe("Each Item:", () => {
    dropdownList.forEach((item, index) => {
      describe(`Item at index ${index}:`, () => {
        test("renders its SiteNavDropdownItem component:", () => {
          const SiteNavDropdownItemComponent =
            listItemElements[index].findComponent(SiteNavDropdownItem);
          expect(SiteNavDropdownItemComponent.exists()).toBe(true);
        });

        test("renders its title", () => {
          expect(SiteNavDropdownItemComponents[index].text()).toContain(
            dropdownList[index].title
          );
        });

        it("has a link with its url value well setted", () => {
          const linkElement = listItemElements[index].find(
            "[data-testid='site-nav__dropdown-list-item-link']"
          );

          // Assert the item has a link tag
          expect(linkElement.exists()).toBe(true);

          // Assert the item has its link value well setted
          expect(linkElement.attributes("to")).toBe(dropdownList[index].url);
        });
      });
    });
  });

  test("emits the 'close-dropdown' custom event when the item is clicked", async () => {
    const firstListItemElement = listItemElements[0];
    await firstListItemElement.trigger("click");
    expect(wrapper.emitted("close-dropdown")).toHaveLength(1);
  });
});
