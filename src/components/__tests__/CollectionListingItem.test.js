import { mount } from "@vue/test-utils";
import CollectionListingItem from "@/components/CollectionListingItem.vue";
import frontDataBase from "../../../db.json";

const collection = frontDataBase.collectionListingGenderData.collections[0];

describe("CollectionListingItem component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CollectionListingItem, {
      props: {
        collection,
      },
    });
  });

  test("renders its title", () => {
    const titleElement = wrapper.find(
      "[data-testid='collectionListing__item-title']"
    );
    expect(titleElement.text()).toContain(collection.title);
  });

  it("has a link with its url value well setted", () => {
    const linkElement = wrapper.find("[data-testid='collectionListing__link']");

    // Assert the title has a link tag
    expect(linkElement.exists()).toBe(true);

    // Assert the title has its link value well setted
    expect(linkElement.attributes("to")).toBe(collection.url);
  });

  it("has its background image url well setted", () => {
    const itemElement = wrapper.find("[data-testid='collectionListing__item']");
    expect(itemElement.attributes("style")).toContain(collection.image);
  });
});
