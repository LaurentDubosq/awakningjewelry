import { mount } from '@vue/test-utils'
import MyTransition from '@/components/MyTransition.vue'
import SiteNavDropdownList from '@/components/SiteNavDropdownList.vue'
import App from '@/App.vue'
import { TransitionGroup, Transition } from 'vue' // Allow us to point the Vue's Built-in component

const mockTransitionGroupSlotInfoWithDuration = {
  slot: SiteNavDropdownList,
  props: {
    name: 'translateY',
    group: true,
    duration: 3500,
  },
  stubs: { SiteNavDropdownList: { template: '<div />' } },
}
const mockTransitionGroupSlotInfoWithoutDuration = {
  slot: SiteNavDropdownList,
  props: {
    name: 'translateY',
    group: true,
  },
  stubs: { SiteNavDropdownList: { template: '<div />' } },
}
const mockTransitionSlotInfo = {
  slot: App,
  props: {
    name: 'marginLeftMinus300px',
    group: false,
  },
  stubs: { App: { template: '<div />' } },
}

// Component Factory
function mountComponent({ slot, props, stubs }) {
  return mount(MyTransition, {
    slots: { default: slot },
    props,
    global: {
      stubs,
    },
  })
}

describe('MyTransition.vue', () => {
  let wrapper

  // Smoke test
  test('mounts successfully', () => {
    // Assert the testing environement is ready for transition group variant
    wrapper = mountComponent(mockTransitionGroupSlotInfoWithDuration)
    expect(wrapper.exists()).toBeTruthy()

    // Assert the testing environement is ready for transition variant
    wrapper = mountComponent(mockTransitionSlotInfo)
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('TransitionGroup.vue', () => {
    it('is rendered with necessary information, with duration prop', () => {
      const mockedProps = mockTransitionGroupSlotInfoWithDuration.props

      // Mounting Component
      const wrapper = mountComponent(mockTransitionGroupSlotInfoWithDuration)

      // Find TransitionGroup component
      const TransitionGroupComponent = wrapper.findComponent(TransitionGroup)

      // Assert the TransitionGroup built-in component is rendered
      expect(TransitionGroupComponent.exists()).toBeTruthy()

      // Assert its 'name' prop value is well setted
      expect(TransitionGroupComponent.props('name')).toBe(mockedProps.name)

      // Assert its 'duration' prop value is well setted
      expect(TransitionGroupComponent.props('duration')).toBe(mockedProps.duration)

      // Assert its slot content is rendered
      const slotComponent = TransitionGroupComponent.findComponent(SiteNavDropdownList)
      expect(slotComponent.exists()).toBeTruthy()
    })

    it('is rendered with necessary information, but without duration prop', () => {
      const mockedProps = mockTransitionGroupSlotInfoWithoutDuration.props

      // Mounting Component
      const wrapper = mountComponent(mockTransitionGroupSlotInfoWithoutDuration)

      // Find TransitionGroup component
      const TransitionGroupComponent = wrapper.findComponent(TransitionGroup)

      // Assert the TransitionGroup built-in component is rendered
      expect(TransitionGroupComponent.exists()).toBeTruthy()

      // Assert its 'name' prop value is well setted
      expect(TransitionGroupComponent.props('name')).toBe(mockedProps.name)

      // Assert its 'duration' prop value has the correct value
      expect(TransitionGroupComponent.props('duration')).toBeUndefined()

      // Assert its slot content is rendered
      const slotComponent = TransitionGroupComponent.findComponent(SiteNavDropdownList)
      expect(slotComponent.exists()).toBeTruthy()
    })
  })

  describe('Transition.vue', () => {
    const mockedProps = mockTransitionSlotInfo.props

    test('is rendered with necessary information', () => {
      // Mounting Component
      wrapper = mountComponent(mockTransitionSlotInfo)

      // Find Transition component
      const TransitionComponent = wrapper.findComponent(Transition)

      // Assert the Transition built-in component is rendered
      expect(TransitionComponent.exists()).toBeTruthy()

      // Assert its 'name' prop value is well setted
      expect(TransitionComponent.props('name')).toBe(mockedProps.name)

      // Assert its slot content is well rendered
      const slotComponent = wrapper.findComponent(App)
      expect(slotComponent.exists()).toBeTruthy()
    })
  })
})
