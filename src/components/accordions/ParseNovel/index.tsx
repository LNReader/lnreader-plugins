import { Box, Button, Pagination, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import AccordionContainer from '../components/AccordionContainer';
import { Plugin } from '@typings/plugin';
import SourceNovelCard from './SourceNovelCard';
import ChapterList from './ChaptertList';
import { useAppStore } from '@store';

export default function ParseNovel() {
  const plugin = useAppStore(state => state.plugin);
  const [sourceNovel, setSouceNovel] = useState<
    (Plugin.SourceNovel & { totalPages?: number }) | undefined
  >();
  const [chapters, setChapters] = useState<Plugin.ChapterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [novelPath, setNovelPath] = useState('');
  const fetchNovel = () => {
    if (plugin) {
      setLoading(true);
      plugin
        .parseNovel(novelPath)
        .then(res => {
          setSouceNovel(res);
          setChapters(res.chapters || []);
        })
        .finally(() => setLoading(false));
    }
  };
  const fetchPage = (page: number) => {
    if (plugin && page) {
      setLoading(true);
      (plugin as Plugin.PagePlugin)
        .parsePage(novelPath, page.toString())
        .then(res => setChapters(res.chapters))
        .finally(() => setLoading(false));
    }
  };
  return (
    <AccordionContainer title="Parse Novel" loading={loading}>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Stack direction={'row'} spacing={2}>
          <TextField
            value={novelPath}
            onChange={e => setNovelPath(e.target.value)}
            size="small"
            label="Novel path"
          />
          <Button
            disabled={plugin === undefined}
            onClick={fetchNovel}
            variant="contained"
          >
            Fetch
          </Button>
        </Stack>
        {sourceNovel ? <SourceNovelCard sourceNovel={sourceNovel} /> : null}
        <Box sx={{ height: 20 }} />
        {chapters.length ? <ChapterList chapters={chapters} /> : null}
        <Box sx={{ height: 20 }} />
        {sourceNovel?.totalPages ? (
          <Pagination
            count={sourceNovel.totalPages}
            onChange={(e, page) => fetchPage(page)}
            variant="outlined"
          />
        ) : null}
      </Box>
    </AccordionContainer>
  );
}
