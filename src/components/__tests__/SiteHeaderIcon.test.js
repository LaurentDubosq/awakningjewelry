import { mount } from "@vue/test-utils";
import SiteHeaderIcon from "@/components/SiteHeaderIcon.vue";
import IconPerson from "@/components/icons/IconPerson.vue";

describe("SiteHeaderIcon Component:", () => {
  test("renders the icon", () => {
    const wrapper = mount(SiteHeaderIcon, {
      slots: { default: IconPerson },
    });
    expect(wrapper.html()).toContain("Human Silhouette Icon");
  });
});
