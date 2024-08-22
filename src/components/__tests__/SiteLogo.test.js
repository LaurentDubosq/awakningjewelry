import { flushPromises, mount } from "@vue/test-utils";
import SiteLogo from "@/components/SiteLogo.vue";
import frontDataBase from "../../../db.json";
import { getPagesMetaData } from "@/composables/fetch";

const pagesMetaData = frontDataBase["pagesMetaData"];

describe("SiteLogo component:", () => {
  test("renders the logo with its title attribut", async () => {
    // Data Fetcher Mock
    vi.mock("@/composables/fetch", () => {
      return {
        getPagesMetaData: vi.fn(),
      };
    });
    getPagesMetaData.mockReturnValue(pagesMetaData);

    // Component Mounting
    const wrapper = mount(SiteLogo);

    // Wait for the onMounted to complete
    await flushPromises();

    // Assert the logo is rendered
    const siteLogoElement = wrapper.find("[data-testid='site-logo']");
    expect(siteLogoElement.exists()).toBe(true);

    // Assert the title attribut value is well setted
    expect(siteLogoElement.attributes("title")).toBe(pagesMetaData[0].title);
  });
});
