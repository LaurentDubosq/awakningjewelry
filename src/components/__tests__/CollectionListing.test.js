import { mount } from "@vue/test-utils";
import CollectionListing from "@/components/CollectionListing.vue";
import CollectionListingItem from "@/components/CollectionListingItem.vue";
import frontDatabase from "../../../db.json";

const collectionListingGenderData = frontDatabase.collectionListingGenderData;

describe("CollectionListing component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CollectionListing, {
      props: { data: collectionListingGenderData },
    });
  });

  test("renders its title", () => {
    const titleElement = wrapper.find(
      "[data-testid='collectionListing__title']"
    );
    expect(titleElement.text()).toContain(collectionListingGenderData.title);
  });

  test("renders all its items with their expected props values", () => {
    // Assert all the expected items are rendered
    const CollectionListingItemComponents = wrapper.findAllComponents(
      CollectionListingItem
    );
    expect(CollectionListingItemComponents).toHaveLength(
      collectionListingGenderData.collections.length
    );

    // Assert the item received the expected "collection" props value
    const firstCollectionListingItemComponent = wrapper.findComponent(
      CollectionListingItem
    );
    expect(
      firstCollectionListingItemComponent.props("collection")
    ).toMatchObject(collectionListingGenderData.collections[0]);
  });
});
