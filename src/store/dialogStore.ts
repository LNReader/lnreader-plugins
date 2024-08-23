import { StoreCreator } from '.';

export enum EDialog {}

export type DialogStore = {
  activeDialogs: EDialog[];
  showDialog(dialog: EDialog): void;
  hideDialog(dialog: EDialog): void;
  hideAllDialogs(): void;
};

/**
 * @param set Use this inside actions to change the state
 * @param get Use this inside actions to get the current state
 */
export const DialogStore: StoreCreator<DialogStore> = set => ({
  // this is initial state
  activeDialogs: [],

  // those are actions
  showDialog(dialog: EDialog) {
    set(state => ({
      ...state,
      activeDialogs: [...state.activeDialogs, dialog],
    }));
  },
  hideDialog(dialog) {
    set(state => ({
      ...state,
      activeDialogs: state.activeDialogs.filter(d => d !== dialog),
    }));
  },
  hideAllDialogs() {
    set(state => ({
      ...state,
      activeDialogs: [],
    }));
  },
});
