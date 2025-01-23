import { type Ref } from "vue";
import { type FetchStatus } from "./utils";

export interface UseFetchWithStateReturn<T> {
  data: Ref<T | undefined>;
  status: Ref<FetchStatus>;
}

export type FetchStatus = "pending" | "resolved" | "rejected";
