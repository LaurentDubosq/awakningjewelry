import { flushPromises, mount } from "@vue/test-utils";
import SiteLogo from "@/components/SiteLogo.vue";
import frontDataBase from "../../../db.json";
import { getPagesMetaData } from "@/composables/fetch";

const pagesMetaData = frontDataBase["pagesMetaData"];

describe("SiteLogo component:", () => {
  test("renders the logo's title attribut", async () => {
    vi.mock("@/composables/fetch", () => {
      return {
        getPagesMetaData: vi.fn(),
      };
    });
    getPagesMetaData.mockReturnValue(pagesMetaData);

    const wrapper = mount(SiteLogo);

    // Wait for the onMounted to complete
    await flushPromises();

    // Assert the title attribut value is well setted
    const siteLogoElement = wrapper.find("[data-testid='site-logo']");
    expect(siteLogoElement.attributes("title")).toBe(
      "Innovante Buddhist Jewelry Brand - AwakningJewelry.com"
    );
  });
});
