import { mount } from "@vue/test-utils";
import CollectionListing from "@/components/CollectionListing.vue";
import CollectionListingItem from "@/components/CollectionListingItem.vue";
import frontDatabase from "../../../db.json";

const collectionListingGender = frontDatabase.collectionListingGender;

describe("CollectionListing component:", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CollectionListing, {
      props: { data: collectionListingGender },
    });
  });

  test("renders its title", () => {
    const titleElement = wrapper.find(
      "[data-testid='collectionListing__title']"
    );
    expect(titleElement.text()).toContain(collectionListingGender.title);
  });

  test("renders all its items with their expected props values", () => {
    // Assert all the expected items are rendered
    const CollectionListingItemComponents = wrapper.findAllComponents(
      CollectionListingItem
    );
    expect(CollectionListingItemComponents).toHaveLength(
      collectionListingGender.collections.length
    );

    // Assert the item received the expected "collection" props value
    const firstCollectionListingItemComponent = wrapper.findComponent(
      CollectionListingItem
    );
    expect(
      firstCollectionListingItemComponent.props("collection")
    ).toMatchObject(collectionListingGender.collections[0]);
  });
});
