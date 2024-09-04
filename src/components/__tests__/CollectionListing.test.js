import { mount } from "@vue/test-utils";
import CollectionListing from "@/components/CollectionListing.vue";
import CollectionListingItem from "@/components/CollectionListingItem.vue";
import frontDatabase from "../../../db.json";

const collectionListingGenderData = frontDatabase.collectionListingGenderData;
const collections = collectionListingGenderData.collections;

describe("CollectionListing component:", () => {
  let wrapper;
  let CollectionListingItemComponents;

  beforeEach(() => {
    wrapper = mount(CollectionListing, {
      props: { data: collectionListingGenderData },
    });
    CollectionListingItemComponents = wrapper.findAllComponents(
      CollectionListingItem
    );
  });

  test("renders its title", () => {
    const titleElement = wrapper.find(
      "[data-testid='collectionListing__title']"
    );
    expect(titleElement.text()).toContain(collectionListingGenderData.title);
  });

  test("renders its collection list entirely", () => {
    expect(CollectionListingItemComponents).toHaveLength(
      collectionListingGenderData.collections.length
    );
  });

  describe("Each item:", () => {
    collections.forEach((collection, index) => {
      describe(`item at index ${index}:`, () => {
        test("has its 'collection' prop value well setted", () => {
          expect(
            CollectionListingItemComponents[index].props("collection")
          ).toMatchObject(collections[index]);
        });
      });
    });
  });
});
