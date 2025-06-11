/* Utility functions to focus */

/**
 * Checks if an HTML element is focusable.
 * @param element - The element to test.
 * @returns true if the element is focusable, false otherwise.
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const tagName = element.tagName.toLowerCase()

  // Natively focusable tags
  const focusableTags = [
    'input',
    'select',
    'textarea',
    'button',
    'object',
    'a',
    'audio',
    'video',
    'iframe',
  ]

  // Special case for links
  if (tagName === 'a') {
    const href = element.getAttribute('href')
    return !!href && href.trim() !== ''
  }

  // Native elements (check if disabled)
  if (focusableTags.includes(tagName)) {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLButtonElement
    ) {
      return !element.disabled
    }
    return true
  }

  // Editable elements
  if (element.hasAttribute('contenteditable')) {
    return element.getAttribute('contenteditable')?.toLowerCase() !== 'false'
  }

  // tabindex >= 0 allows focus via keyboard and script
  if (element.hasAttribute('tabindex')) {
    const tabindex = parseInt(element.getAttribute('tabindex') || '', 10)
    return !isNaN(tabindex) && tabindex >= 0
  }

  return false
}

/**
 * Returns the first focusable child of a given element.
 * @param element - The parent element to search within.
 * @returns The first focusable child element, or null if none is found.
 */
const getFirstFocusableChildElement = (element: HTMLElement): HTMLElement | null => {
  const childElements = element.querySelectorAll('*')

  for (let i = 0; i < childElements.length; i++) {
    const childElement = childElements[i]
    if (childElement instanceof HTMLElement && isFocusable(childElement)) {
      return childElement
    }
  }

  return null
}

export const useFocusFirstFocusableChildElement = (element: HTMLElement) => {
  // Get the child focusable element
  const focusableElement = getFirstFocusableChildElement(element)

  // Focus the element
  if (focusableElement) {
    focusableElement.focus()
  }
}
