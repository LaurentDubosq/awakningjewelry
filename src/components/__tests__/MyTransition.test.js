import { mount } from "@vue/test-utils";
import MyTransition from "@/components/MyTransition.vue";
import SiteNavDropdownList from "@/components/SiteNavDropdownList.vue"; // Arbitrary component
import { TransitionGroup, Transition } from "vue"; // Allow us to point the Vue's Built-in component

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

    it("is rendered when filled with its 'name', 'duration' props, and its slot content", () => {
      const TransitionGroupComponent = wrapper.findComponent(TransitionGroup);

      // Assert the vue's built-in component is rendered
      expect(TransitionGroupComponent.exists()).toBe(true);

      // Assert its 'name' prop value is well setted
      expect(TransitionGroupComponent.props("name")).toBe(name);

      // Assert its 'duration' prop value is well setted
      expect(TransitionGroupComponent.props("duration")).toBe(duration);

      // Assert its slot content is rendered
      const SiteNavDropdownListComponent =
        TransitionGroupComponent.findComponent(SiteNavDropdownList);
      expect(SiteNavDropdownListComponent.exists()).toBe(true);
    });

    it("is rendered when filled with its 'name' prop , its slot content, but without the 'duration' prop", () => {
      wrapper = mount(MyTransition, {
        slots: { default: SiteNavDropdownList },
        props: { name: name, group: true },
      });

      const TransitionGroupComponent = wrapper.findComponent(TransitionGroup);

      // Assert the vue's built-in component is rendered
      expect(TransitionGroupComponent.exists()).toBe(true);

      // Assert its 'name' prop value is well setted
      expect(TransitionGroupComponent.props("name")).toBe(name);

      // Assert its 'duration' prop value is undefined
      expect(TransitionGroupComponent.props("duration")).toBe(undefined);

      // Assert its slot content is rendered
      const SiteNavDropdownListComponent =
        TransitionGroupComponent.findComponent(SiteNavDropdownList);
      expect(SiteNavDropdownListComponent.exists()).toBe(true);
    });
  });

  describe("Transition component:", () => {
    beforeEach(() => {
      wrapper = mount(MyTransition, {
        slots: { default: SiteNavDropdownList },
        props: { name },
      });
    });

    test("is rendered with its 'name' prop value and its nested component", () => {
      const TransitionComponent = wrapper.findComponent(Transition);
      const SiteNavDropdownListComponent =
        wrapper.findComponent(SiteNavDropdownList);

      // Assert the vue's built-in component is rendered
      expect(TransitionComponent.exists()).toBe(true);

      // Assert its 'name' prop value is well setted
      expect(TransitionComponent.props("name")).toBe(name);

      // Assert its the slot content is well rendered
      expect(SiteNavDropdownListComponent.exists()).toBe(true);
    });
  });
});
