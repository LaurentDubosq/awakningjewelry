import { mount } from "@vue/test-utils";
import SiteHeaderIcon from "@/components/SiteHeaderIcon.vue";
import IconPerson from "@/components/icons/IconPerson.vue";

describe("SiteHeaderIcon Component:", () => {
  test("renders its icon component as slot content", () => {
    const wrapper = mount(SiteHeaderIcon, {
      slots: { default: IconPerson },
    });
    const IconPersonComponent = wrapper.findComponent(IconPerson);
    expect(IconPersonComponent.exists()).toBe(true);
  });
});
