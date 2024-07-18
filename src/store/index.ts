import { create, StateCreator } from 'zustand';
import { PluginStore } from './pluginStore';
import { DialogStore } from './dialogStore';
import { OverlayStore } from './overlayStore';

export type AppStore = DialogStore & OverlayStore & PluginStore;

// Helper types to use "slicing" like in Redux... We could just not use slicing, but eh
export type SetStore = Parameters<StateCreator<AppStore>>[0];
export type GetStore = Parameters<StateCreator<AppStore>>[1];
export type StoreCreator<T> = (s: SetStore, g: GetStore) => T;

export const useAppStore = create<AppStore>((set: SetStore, get: GetStore) => ({
  ...DialogStore(set, get),
  ...OverlayStore(set, get),
  ...PluginStore(set, get),
}));
