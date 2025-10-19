import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { useAppStore } from '@store';
import { Plugin } from '@typings/plugin';

type SearchNovelsSectionProps = {
  onNavigateToParseNovel?: () => void;
};

export default function SearchNovelsSection({
  onNavigateToParseNovel,
}: SearchNovelsSectionProps) {
  const plugin = useAppStore(state => state.plugin);
  const setParseNovelPath = useAppStore(state => state.setParseNovelPath);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [novels, setNovels] = useState<Plugin.NovelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchNovels = async (page: number) => {
    if (plugin && searchTerm.trim()) {
      setLoading(true);
      setFetchError('');
      try {
        const results = await plugin.searchNovels(searchTerm, page);
        setNovels(results);
        setCurrentPage(page);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch novels';
        setFetchError(errorMessage);
        console.error('Error searching novels:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setNovels([]);
    setSearchTerm('');
    setFetchError('');
  }, [plugin]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      fetchNovels(1);
    }
  };

  const handleParseNovel = (path: string) => {
    setParseNovelPath(path, true);
    onNavigateToParseNovel?.();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Search Novels
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {plugin
                ? 'Search for novels by title or keywords'
                : 'Select a plugin to search novels'}
            </p>
          </div>
          {currentPage > 1 && (
            <Badge variant="secondary">Page {currentPage}</Badge>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={!plugin}
          />
          <Button
            onClick={() => fetchNovels(1)}
            disabled={!plugin || !searchTerm.trim() || loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchNovels(currentPage + 1)}
            disabled={!plugin || novels.length === 0 || loading}
          >
            Next Page
          </Button>
        </div>

        {fetchError && (
          <div className="p-4 mb-6 border border-destructive/50 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive">{fetchError}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Searching for novels...</p>
          </div>
        ) : novels.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? 'No novels found. Try a different search term.'
                : plugin
                  ? 'Enter a search term and click "Search" to find novels.'
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
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(novel.path);
                      toast.success('Novel path copied to clipboard!');
                    }}
                  >
                    Copy Path
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleParseNovel(novel.path)}
                    title="Parse this novel"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Parse
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
