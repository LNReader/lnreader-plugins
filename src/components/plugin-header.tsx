import React from 'react';
import { BookMarked } from 'lucide-react';

import { Plugin } from '@/types/plugin';

interface PluginHeaderProps {
  selectedPlugin?: Plugin.PluginBase;
}

export default function PluginHeader({ selectedPlugin }: PluginHeaderProps) {
  return (
    <header className="border-b">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <BookMarked className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Plugin Playground
            </h1>
            <p className="text-xs text-muted-foreground">
              {selectedPlugin?.name}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
