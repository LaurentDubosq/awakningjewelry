import { mount } from "@vue/test-utils";
import MyTransition from "@/components/MyTransition.vue";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue";

describe("MyTransition component:", () => {
  let wrapper;
  const name = "margintopMinus100PerCentWithInner";

  beforeEach(() => {
    wrapper = mount(MyTransition, {
      slots: { default: SiteNavDropdownList },
      props: { name },
    });
  });

  test("renders its slot content component", () => {
    const SiteNavDropdownListComponent =
      wrapper.findComponent(SiteNavDropdownList);
    expect(SiteNavDropdownListComponent.exists()).toBe(true);
  });

  test("has its 'name' prop value well setted", () => {
    const transitionComponent = wrapper.findComponent(
      "[data-testid='transition']"
    );
    expect(transitionComponent.props("name")).toBe(name);
  });
});
