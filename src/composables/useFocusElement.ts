// Utility function to check if an element is focusable
const isFocusableElement = (element: HTMLElement | null): boolean => {
  return (
    element instanceof HTMLAnchorElement || element instanceof HTMLButtonElement
  );
};

// Function to focus the first focusable child in a container
const focusFirstFocusableChild = (container: HTMLElement) => {
  const focusableChild = container.querySelector(
    "button, a"
  ) as HTMLElement | null;

  if (focusableChild) {
    focusableChild.focus();
  }
};

// Composable to focus an element if focusable, or its first focusable child
export const useFocusElement = (element: HTMLElement | null) => {
  if (!element) return;

  if (isFocusableElement(element)) {
    element.focus();
  } else {
    focusFirstFocusableChild(element);
  }
};
