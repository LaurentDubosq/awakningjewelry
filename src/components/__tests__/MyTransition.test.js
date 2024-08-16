import { mount } from "@vue/test-utils";
import MyTransition from "@/components/MyTransition.vue";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue";

describe("MyTransition component:", () => {
  let wrapper;
  const name = "margintopMinus100PerCentWithInner";
  const duration = 3500;

  describe("TransitionGroup component:", () => {
    beforeEach(() => {
      wrapper = mount(MyTransition, {
        slots: { default: SiteNavDropdownList },
        props: { name: name, group: true, duration: duration },
      });
    });

    test("is rendered, and renders the 'name' prop, the 'duration' prop and its nested component", () => {
      const transitionGroupComponent = wrapper.findComponent(
        "[data-testid='transitionGroup']"
      );
      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);

      // Assert the component is rendered
      expect(transitionGroupComponent.exists()).toBe(true);

      // Assert its 'name' prop value is well setted
      expect(transitionGroupComponent.props("name")).toBe(name);

      // Assert its 'duration' prop value is well setted
      expect(transitionGroupComponent.props("duration")).toBe(duration);

      // Assert its nested component as slot content
      expect(SiteNavDropdownListComponent.exists()).toBe(true);
    });
  });

  describe("Transition component:", () => {
    beforeEach(() => {
      wrapper = mount(MyTransition, {
        slots: { default: SiteNavDropdownList },
        props: { name, group: false },
      });
    });

    test("is rendered, and renders its 'name' prop and its nested component", () => {
      const transitionComponent = wrapper.findComponent(
        "[data-testid='transition']"
      );
      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);

      // Assert the component is rendered
      expect(transitionComponent.exists()).toBe(true);

      // Assert its 'name' prop value is well setted
      expect(transitionComponent.props("name")).toBe(name);

      // Assert its nested component as slot content
      expect(SiteNavDropdownListComponent.exists()).toBe(true);
    });
  });
});
