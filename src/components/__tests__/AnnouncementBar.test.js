import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AnnouncementBar from '@/components/AnnouncementBar.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import frontDataBase from '../../../db.json'
import { getAnnouncementBarWording } from '@/data/dataFetchers'

/**************/
/* 1.Hoisting */
/**************/

// Mock the "getAnnouncementBarWording" data fetcher
vi.mock('@/data/dataFetchers', () => {
  return {
    getAnnouncementBarWording: vi.fn(),
  }
})

/********************/
/* 2.Initialization */
/********************/

/* Data */

const data = frontDataBase.announcementBarWording
const mockAnnouncementPending = {
  data: ref(undefined),
  state: ref('pending'),
}
const mockAnnouncementRejected = {
  data: ref(undefined),
  state: ref('rejected'),
}
const mockAnnouncementFulfilled = {
  data: ref(data),
  state: ref('fulfilled'),
}
const mockAnnouncement = data.announcement

/***********/
/* 3.Build */
/***********/

// Component factory (Data fetching "Pending" state)
const mountAnnouncementBar = () => {
  return mount(AnnouncementBar, { attachTo: document.body })
}

/**********/
/* 4.Test */
/**********/

// WARNING : The component has 3 states regarding the data fetching state. "Pending", "Rejected" and "Fulfilled". The state by default is "Pending".

describe('AnnouncementBar.vue', () => {
  let wrapper

  beforeEach(() => {
    // Set the getAnnouncementBarWording mock state to pending
    getAnnouncementBarWording.mockReturnValue(mockAnnouncementPending)

    // Component mounting (Data fetching "Pending" state)
    wrapper = mountAnnouncementBar()
  })

  // Smoke test
  test('mounts successfully', () => {
    // Assert the wrapper component is well mounted at initial render
    expect(wrapper.exists()).toBeTruthy()
  })

  // Renders
  describe('Renders:', () => {
    describe('Initial render - Data fetching "Pending" state', () => {
      test('the loader animation is rendered', async () => {
        const loadingComponent = wrapper.findComponent(LoadingComponent)
        expect(loadingComponent.exists()).toBeTruthy()
      })
    })

    describe('Data fetching "Rejected" state', () => {
      test('the error message is rendered', async () => {
        // Set the getAnnouncementBarWording fetcher mock state to rejected
        getAnnouncementBarWording.mockReturnValue(mockAnnouncementRejected)

        // Remount the component with the rejected state
        wrapper = mountAnnouncementBar()

        // Assert the error message is rendered
        const errorComponent = wrapper.findComponent(ErrorComponent)
        expect(errorComponent.exists()).toBeTruthy()
      })
    })

    describe('Data fetching "Fulfilled" state', () => {
      beforeEach(async () => {
        // Set the getAnnouncementBarWording fetcher mock state to fulfilled
        getAnnouncementBarWording.mockReturnValue(mockAnnouncementFulfilled)

        // Remount the component with the fulfilled state
        wrapper = mountAnnouncementBar()
      })

      test('renders its announcement', () => {
        const announcement = wrapper.find("[data-testid='announcement-bar__announcement']")
        expect(announcement.html()).toContain(mockAnnouncement)
      })

      test('renders its close button with informations', () => {
        // Assert the button is rendered
        const button = wrapper.find("[data-testid='announcement-bar__button']")
        expect(button.isVisible()).toBeTruthy()

        // Assert the cross icon is rendered
        const icon = wrapper.find("[data-testid='icon-cross']")
        expect(icon.isVisible()).toBeTruthy()

        // Assert the alternative text is rendered
        const alternativeText = wrapper.find(
          "[data-testid='announcement-bar__icon-alternative-text']",
        )
        expect(alternativeText.text()).toContain('Close announcement bar')
      })
    })
  })

  // Behaviors
  describe('Behaviors:', () => {
    test('When the close button is clicked, the order to close the announcement bar has been emitted', async () => {
      // Set the getAnnouncementBarWording fetcher mock state to fulfilled
      getAnnouncementBarWording.mockReturnValue(mockAnnouncementFulfilled)

      // Remount the component with the fulfilled state
      wrapper = mountAnnouncementBar()

      // Assert the announcement bar is rendered
      const bar = wrapper.find("[data-testid='announcement-bar']")
      expect(bar.isVisible()).toBeTruthy()

      // Click/touch the close button
      const button = wrapper.find("[data-testid='announcement-bar__button']")
      await button.trigger('click')

      // Assert the announcement bar is not rendered
      expect(wrapper.emitted('closeAnnouncementBar')).toHaveLength(1)
    })
  })
})
