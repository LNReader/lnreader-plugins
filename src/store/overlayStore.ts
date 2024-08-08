import { StoreCreator } from '.';

export type OverlayStore = {
  loading: boolean;
  showLoading(): void;
  hideLoading(): void;
};

/**
 * @param set Use this inside actions to change the state
 * @param get Use this inside actions to get the current state
 */
export const OverlayStore: StoreCreator<OverlayStore> = set => ({
  // this is initial state
  loading: false,

  // those are actions
  showLoading() {
    set(state => ({
      ...state,
      loading: true,
    }));
  },
  hideLoading() {
    set(state => ({
      ...state,
      loading: false,
    }));
  },
});
