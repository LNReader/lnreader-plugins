import { Box, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import AccordionContainer from '../components/AccordionContainer';
import { Plugin } from '@typings/plugin';
import NovelItemCard from '../components/NovelItemCard';
import { Filters } from '@libs/filterInputs';
import usePlugin from '@hooks/usePlugin';

export default function PopularNovels() {
  const plugin = usePlugin();
  const [novels, setNovels] = useState<Plugin.NovelItem[]>([]);
  const [filters, setFilters] = useState<Filters>();
  const [loading, setLoading] = useState(false);
  const fetchNovels = () => {
    if (plugin) {
      setLoading(true);
      plugin
        .popularNovels(1, { filters, showLatestNovels: false })
        .then(res => setNovels(res))
        .finally(() => setLoading(false));
    }
  };
  return (
    <AccordionContainer title="Popular Novels" loading={loading}>
      <Stack direction={'row'} spacing={2}>
        <Button
          disabled={plugin === undefined}
          onClick={fetchNovels}
          variant="contained"
        >
          Fetch
        </Button>
        <Button disabled={plugin === undefined} variant="outlined">
          Next Page
        </Button>
      </Stack>
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Stack sx={{ width: 'max-content' }} direction={'row'} spacing={2}>
          {novels.map((novel, index) => (
            <NovelItemCard key={'novelItem_' + index} item={novel} />
          ))}
        </Stack>
      </Box>
    </AccordionContainer>
  );
}
