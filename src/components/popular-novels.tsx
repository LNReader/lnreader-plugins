import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { useAppStore } from '@store';
import { Plugin } from '@typings/plugin';
import { FilterToValues, Filters } from '@libs/filterInputs';

export default function PopularNovelsSection() {
  const plugin = useAppStore(state => state.plugin);
  const [novels, setNovels] = useState<Plugin.NovelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isLatest, setIsLatest] = useState(true);
  const [filterValues, setFilterValues] = useState<
    FilterToValues<Filters> | undefined
  >();

  const fetchNovelsByIndex = async (index: number) => {
    if (plugin && index) {
      setLoading(true);
      try {
        const fetchedNovels = await plugin.popularNovels(index, {
          filters: filterValues || {},
          showLatestNovels: isLatest,
        });
        if (fetchedNovels.length !== 0) {
          setCurrentIndex(index);
          if (index > maxIndex) {
            setMaxIndex(index);
          }
          setNovels(fetchedNovels);
        }
      } catch (error) {
        console.error('Error fetching novels:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (plugin) {
      setCurrentIndex(1);
      setMaxIndex(1);
      fetchNovelsByIndex(1);
    }
  }, [isLatest]);

  useEffect(() => {
    // Reset when changing plugins
    setCurrentIndex(0);
    setMaxIndex(0);
    setNovels([]);

    if (plugin?.filters) {
      const filters: FilterToValues<typeof plugin.filters> = {};
      for (const fKey in plugin.filters) {
        filters[fKey as keyof typeof filters] = {
          type: plugin.filters[fKey].type,
          value: plugin.filters[fKey].value,
        };
      }
      setFilterValues(filters);
    }
  }, [plugin]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Popular Novels
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {plugin
                ? `Browse ${isLatest ? 'latest' : 'popular'} novels`
                : 'Select a plugin to browse novels'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              disabled={!plugin || isLatest || !plugin.filters}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button
              size="sm"
              disabled={!plugin || loading}
              onClick={() => fetchNovelsByIndex(1)}
            >
              {loading ? 'Loading...' : 'Fetch'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0 || loading}
              onClick={() => fetchNovelsByIndex(currentIndex + 1)}
            >
              Next Page
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['Latest', 'Popular'].map(option => (
            <Badge
              key={option}
              variant={
                isLatest === (option === 'Latest') ? 'default' : 'outline'
              }
              className="cursor-pointer"
              onClick={() => setIsLatest(option === 'Latest')}
            >
              {option}
            </Badge>
          ))}
          {currentIndex > 0 && (
            <Badge variant="secondary" className="ml-auto">
              Page {currentIndex}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading novels...</p>
          </div>
        ) : novels.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              {plugin
                ? 'No novels found. Click "Fetch" to load novels.'
                : 'Please select a plugin first.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
            {novels.map((novel, index) => (
              <div
                key={`${novel.path}-${index}`}
                className="group cursor-pointer"
              >
                <div className="relative mb-4 overflow-hidden rounded-lg bg-muted aspect-[3/4]">
                  <img
                    src={novel.cover || '/static/coverNotAvailable.webp'}
                    alt={novel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                  {novel.name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(novel.path);
                  }}
                >
                  Copy Path
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
