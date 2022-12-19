import store from "immerhin";
import {
  rootInstanceContainer,
  breakpointsContainer,
  designTokensContainer,
} from "~/shared/nano-states";

export const registerContainers = () => {
  store.register("breakpoints", breakpointsContainer);
  store.register("root", rootInstanceContainer);
  store.register("designTokens", designTokensContainer);
};
