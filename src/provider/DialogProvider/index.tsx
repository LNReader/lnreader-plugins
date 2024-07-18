import React from 'react';
import { useAppStore } from '@store';

export default function DialogProvider() {
  const activeDialogs = useAppStore(state => state.activeDialogs);

  return <></>;
}
