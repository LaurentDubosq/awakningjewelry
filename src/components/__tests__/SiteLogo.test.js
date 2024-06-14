import { mount } from "@vue/test-utils";
import { describe, test, expect, vi, beforeEach } from "vitest";
import SiteLogo from "@/components/SiteLogo.vue";
import frontDataBase from "../../../db.json";

describe("SiteLogo component:", () => {
  let wrapper;

  beforeEach(() => {
    const { mockedMethod } = vi.hoisted(() => {
      return { mockedMethod: vi.fn() };
    });
    vi.mock("@/router/index", async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        originalMethod: mockedMethod,
      };
    });
    mockedMethod.mockReturnValue(frontDataBase.pagesMetaData);

    wrapper = mount(SiteLogo);
  });

  test("renders the logo correctly", () => {
    // Additional test - because of critical component
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<img data-v-164b155e="" src="/src/assets/logo.svg" alt="AwakningJewelry's logo - Illustration of a person medidating above the AwakningJewelry brand name" title="Innovante Buddhist Jewelry Brand - AwakningJewelry.com" class="site-logo">"`
    );
  });
});
