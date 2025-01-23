import { ref, type Ref } from "vue";

/* This composable return the reduced motion statut of the user operating system and/or the browser */
export default function isReducedMotion () {
    // Get the reduce motion preference object
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Creatation of a Vue controlled variable to keep the DOM in sync with the variable
    const isActivated: Ref<boolean> = ref(prefersReducedMotion.matches)

    // Listen to the user preference toggle and update the controlled Vue variable
    prefersReducedMotion.addEventListener('change', (event) => {
        if (event.matches) {
            isActivated.value = event.matches
        } else {
            isActivated.value = event.matches
        }
    });

    // Return the dynamic preference's statut
    return isActivated
}