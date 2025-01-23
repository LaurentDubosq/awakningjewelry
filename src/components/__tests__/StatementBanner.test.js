import { mount } from "@vue/test-utils";
import StatementBanner from "@/components/StatementBanner.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import frontDataBase from "../../../db.json";

const mockStatementResult = { data: { value: frontDataBase.statementMission } };
const mockStatementData = mockStatementResult.data.value;
const mockStatementTitle = mockStatementData.title;
const mockStatementText = mockStatementData.text;
const mockStatementImageURL = mockStatementData.image.url;
const mockStatementImageAlt = mockStatementData.image.alt;

// Component Factory
function mountStatementBanner(status = "resolved") {
  return mount(StatementBanner, {
    props: {
      statementResult: { ...mockStatementResult, status: { value: status } },
    },
  });
}

describe("StatementBanner.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountStatementBanner();
  });

  // Smoke test
  test("mounts successfully", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test("renders the statement with necessary information", () => {
    const title = wrapper.find("[data-testid='statement-banner__title']");
    const text = wrapper.find("[data-testid='statement-banner__text']");
    const image = wrapper.find("[data-testid='statement-banner__image']");

    // Assert its title is rendered
    expect(title.text()).toContain(mockStatementTitle);

    // Assert its text is rendered
    expect(text.text()).toContain(mockStatementText);

    // Assert the image is rendered
    expect(image.exists()).toBeTruthy();

    // Assert the image "src" attribute is well setted
    expect(image.attributes("src")).toBe(mockStatementImageURL);

    // Assert the image "alt" attribute is well setted
    expect(image.attributes("alt")).toBe(mockStatementImageAlt);
  });

  describe("Behaviors:", () => {
    test("when the data fetcher status is 'pending', the loading component is rendered", () => {
      // Remount the component with pending status active
      wrapper = mountStatementBanner("pending");

      // Assert the loading component is rendered
      const loadingComponent = wrapper.findComponent(LoadingComponent);
      expect(loadingComponent.exists()).toBeTruthy();
    });

    test("when the data fetcher status is 'resolved', its data is rendered", () => {
      // Assert that one of its pieces of data is rendered
      const title = wrapper.find("[data-testid='statement-banner__title']");
      expect(title.exists()).toBeTruthy();
    });

    test("when the data fetcher status is 'rejected', the error component is rendered", () => {
      // Remount the component with rejected status active
      wrapper = mountStatementBanner("rejected");

      // Assert the error component is rendered
      const errorComponent = wrapper.findComponent(ErrorComponent);
      expect(errorComponent.exists()).toBeTruthy();
    });
  });
});
