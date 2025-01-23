import LoadingComponent from "@/components/LoadingComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";

// Composable handling asynchronous import status
export default function useGetAsyncComponent(name: String) {
  return {
    // Loader component function
    loader: () => import(`@/components/${name}.vue`),

    // A component to use while the async component is loading
    loadingComponent: LoadingComponent,
    // Delay before showing the loading component. Default: 200ms.
    delay: 200,

    // A component to use if the load fails
    errorComponent: ErrorComponent,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 5000, // 5 seconds
  };
}
