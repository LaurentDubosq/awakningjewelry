import { getCollectionListing } from "@/composables/fetch";
import frontDatabase from "../../../db.json";
import { mount } from "@vue/test-utils";
import CollectionListing from "@/components/CollectionListing.vue";
import CollectionListingItem from "@/components/CollectionListingItem.vue";

const componentCollectionListing = frontDatabase.componentCollectionListing;

describe("CollectionListing component:", () => {
  let wrapper;

  beforeEach(() => {
    vi.mock("@/composables/fetch", () => {
      return {
        getCollectionListing: vi.fn(),
      };
    });
    getCollectionListing.mockReturnValue(componentCollectionListing);

    wrapper = mount(CollectionListing);
  });

  test("renders its title", () => {
    const titleElement = wrapper.find(
      "[data-testid='collectionListing__title']"
    );
    expect(titleElement.text()).toContain(componentCollectionListing.title);
  });

  test("renders all its items with their expected props values", () => {
    // Assert all the expected items are rendered
    const CollectionListingItemComponents = wrapper.findAllComponents(
      CollectionListingItem
    );
    expect(CollectionListingItemComponents).toHaveLength(
      componentCollectionListing.collections.length
    );

    // Assert the item received the expected "collection" props value
    const firstCollectionListingItemComponent = wrapper.findComponent(
      CollectionListingItem
    );
    expect(
      firstCollectionListingItemComponent.props("collection")
    ).toMatchObject(componentCollectionListing.collections[0]);
  });
});
