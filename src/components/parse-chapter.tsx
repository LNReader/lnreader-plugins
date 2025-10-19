import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { useAppStore } from '@store';

export default function ParseChapterSection() {
  const plugin = useAppStore(state => state.plugin);
  const [chapterPath, setChapterPath] = useState('');
  const [chapterText, setChapterText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchChapter = async () => {
    if (plugin && chapterPath.trim()) {
      setLoading(true);
      setFetchError('');
      try {
        const result = await plugin.parseChapter(chapterPath);
        setChapterText(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch chapter';
        setFetchError(errorMessage);
        console.error('Error parsing chapter:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && chapterPath.trim()) {
      fetchChapter();
    }
  };

  const copyToClipboard = (text?: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Parse Chapter
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {plugin
                ? 'Enter a chapter path to fetch content'
                : 'Select a plugin to parse chapters'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Enter chapter path..."
            value={chapterPath}
            onChange={e => setChapterPath(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={!plugin}
          />
          <Button
            onClick={fetchChapter}
            disabled={!plugin || !chapterPath.trim() || loading}
          >
            {loading ? 'Fetching...' : 'Fetch'}
          </Button>
        </div>

        {fetchError && (
          <div className="p-4 mb-6 border border-destructive/50 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive">{fetchError}</p>
          </div>
        )}

        {loading && !chapterText ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading chapter content...</p>
          </div>
        ) : chapterText ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Chapter Content
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {chapterPath}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => copyToClipboard(chapterPath)}
                >
                  <Copy className="w-4 h-4" />
                  Copy Path
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => copyToClipboard(chapterText)}
                >
                  <Copy className="w-4 h-4" />
                  Copy Text
                </Button>
              </div>
            </div>

            <div className="border border-border rounded-lg">
              <div className="bg-muted/50 rounded-t-lg px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground font-medium">
                  CHAPTER CONTENT ({chapterText.length} characters)
                </p>
              </div>
              <div className="bg-background rounded-b-lg p-6 max-h-[600px] overflow-y-auto">
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: chapterText,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Content loaded successfully
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setChapterText('');
                  setChapterPath('');
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
