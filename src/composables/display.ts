import SASSCONSTANTS from "@/assets/styles/_constants.module.scss";
import { ref, type Ref } from "vue";

const AwakningBreakpointDesktop: number = Number(
  SASSCONSTANTS.AwakningBreakpointDesktop.slice(0, -2)
);
const isOnMobile: Ref<boolean> = ref(
  window.innerWidth < AwakningBreakpointDesktop
);

window.addEventListener("resize", () => {
  if (window.innerWidth < AwakningBreakpointDesktop) {
    isOnMobile.value = true;
  } else {
    isOnMobile.value = false;
  }
});

export const useIsOnMobile = (): Ref<boolean> => isOnMobile;
