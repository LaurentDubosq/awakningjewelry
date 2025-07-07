import { mount } from '@vue/test-utils'
import MyTransition from '@/components/MyTransition.vue'
import { TransitionGroup, Transition } from 'vue' // Allow us to point the Vue's Built-in component

/********************/
/* 1.Initialization */
/********************/

const mockSlotComponent = { template: '<div class="mock-slot-content" />' }
const mockSiteNavDropdownListAnimationOptions = {
  slot: mockSlotComponent,
  props: {
    name: 'vertical-top-subtle-slide',
    group: true,
  },
}
const mockSiteNavDropdownListAnimationOptionsProps = mockSiteNavDropdownListAnimationOptions.props
const mockBurgerMenuAnimationOptions = {
  slot: mockSlotComponent,
  props: {
    name: 'horizontal-left-slide',
    group: false,
  },
}
const mockBurgerMenuAnimationOptionsProps = mockBurgerMenuAnimationOptions.props
const mockBurgerMenuDropdownListAnimationOptions = {
  slot: mockSlotComponent,
  props: {
    name: 'vertical-top-slide',
    group: true,
    duration: 300,
  },
}
const mockBurgerMenuDropdownListAnimationOptionsProps =
  mockBurgerMenuDropdownListAnimationOptions.props

/***********/
/* 2.Build */
/***********/

// Component Factory (Neutral built-in component) (Utility component)
const mountComponent = ({ slot, props, stubs }) => {
  return mount(MyTransition, {
    slots: { default: slot },
    props,
    global: {
      stubs,
    },
  })
}

/**********/
/* 3.Test */
/**********/

// WARNING : The component has 2 states regarding if we have to use the built-in component TransitionGroup or Transition.
// There is none used by default. So, as this component is an utility component, we have to check implementation details,
// such as the built-in animation component used in addition to the slot content.

describe('MyTransition.vue', () => {
  // Smoke test
  test('mounts successfully', () => {
    let wrapper

    /**********************************************************************************************/
    /* Assert the component is well mounted when the "TransitionGroup" built in component is used */
    /**********************************************************************************************/

    // Mount the component with the TransitionGroup setup
    wrapper = mountComponent(mockSiteNavDropdownListAnimationOptions)

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()

    /*****************************************************************************************/
    /* Assert the component is well mounted when the "Transition" built in component is used */
    /*****************************************************************************************/

    // Mount the component with the Transition setup
    wrapper = mountComponent(mockBurgerMenuAnimationOptions)

    // Assert the wrapper component is well mounted
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('SiteNavDropdownList.vue animation', () => {
    test('is renderedable and the component necessary information are well setted', () => {
      // Mounting Component
      const wrapper = mountComponent(mockSiteNavDropdownListAnimationOptions)

      // Find TransitionGroup component
      const TransitionGroupComponent = wrapper.findComponent(TransitionGroup)

      // Assert the TransitionGroup built-in component is rendered
      expect(TransitionGroupComponent.exists()).toBeTruthy()

      // Assert its 'name' prop value is well setted
      expect(TransitionGroupComponent.props('name')).toBe(
        mockSiteNavDropdownListAnimationOptionsProps.name,
      )

      // Assert its slot content is rendered
      const slotComponent = TransitionGroupComponent.findComponent(mockSlotComponent)
      expect(slotComponent.exists()).toBeTruthy()
    })
  })

  describe('BurgerMenu.vue animation', () => {
    test('is renderedable and the component necessary information are well setted', () => {
      // Mounting Component
      const wrapper = mountComponent(mockBurgerMenuAnimationOptions)

      // Find Transition component
      const TransitionComponent = wrapper.findComponent(Transition)

      // Assert the Transition built-in component is rendered
      expect(TransitionComponent.exists()).toBeTruthy()

      // Assert its 'name' prop value is well setted
      expect(TransitionComponent.props('name')).toBe(mockBurgerMenuAnimationOptionsProps.name)

      // Assert its slot content is rendered
      const slotComponent = TransitionComponent.findComponent(mockSlotComponent)
      expect(slotComponent.exists()).toBeTruthy()
    })
  })

  describe('BurgerMenuDropdownList.vue animation', () => {
    test('is renderedable and the component necessary information are well setted', () => {
      // Mounting Component
      const wrapper = mountComponent(mockBurgerMenuDropdownListAnimationOptions)

      // Find TransitionGroup component
      const TransitionGroupComponent = wrapper.findComponent(TransitionGroup)

      // Assert the TransitionGroup built-in component is rendered
      expect(TransitionGroupComponent.exists()).toBeTruthy()

      // Assert its 'name' prop value is well setted
      expect(TransitionGroupComponent.props('name')).toBe(
        mockBurgerMenuDropdownListAnimationOptionsProps.name,
      )

      // Assert its 'duration' prop value is well setted
      expect(TransitionGroupComponent.props('duration')).toBe(
        mockBurgerMenuDropdownListAnimationOptionsProps.duration,
      )

      // Assert its slot content is rendered
      const slotComponent = TransitionGroupComponent.findComponent(mockSlotComponent)
      expect(slotComponent.exists()).toBeTruthy()
    })
  })
})
