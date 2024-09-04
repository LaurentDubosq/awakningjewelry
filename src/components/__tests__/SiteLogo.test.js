import { flushPromises, mount } from "@vue/test-utils";
import SiteLogo from "@/components/SiteLogo.vue";
import frontDataBase from "../../../db.json";
import { getPagesMetaData } from "@/composables/fetch";

const pagesMetaData = frontDataBase["pagesMetaData"];

describe("SiteLogo component:", async () => {
  vi.mock("@/composables/fetch", () => {
    return {
      getPagesMetaData: vi.fn(),
    };
  });
  getPagesMetaData.mockReturnValue(pagesMetaData);

  const wrapper = mount(SiteLogo);

  await flushPromises(); // Wait until the onMounted hook has been executed

  const siteLogoElement = wrapper.find("[data-testid='site-logo']");

  describe("Logo's image element:", () => {
    test("is rendered", () => {
      expect(siteLogoElement.exists()).toBe(true);
    });

    test("receives the expected title attribut value", () => {
      expect(siteLogoElement.attributes("title")).toBe(pagesMetaData[0].title);
    });

    test("has an alt attribut value", () => {
      const altLength = siteLogoElement.attributes("alt").length;
      expect(altLength).toBeGreaterThan(0);
    });
  });
});
