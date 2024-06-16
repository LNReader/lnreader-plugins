import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import React, { useEffect, useState, ChangeEvent } from 'react';
import AccordionContainer from '../components/AccordionContainer';
import { Plugin } from '@typings/plugin';
import NovelItemCard from '../components/NovelItemCard';
import { Filters } from '@libs/filterInputs';
import usePlugin from '@hooks/usePlugin';

export default function PopularNovels() {
  const plugin = usePlugin();
  const [novels, setNovels] = useState<Plugin.NovelItem[]>([]);
  const [filterValues, setFilterValues] = useState<Filters | undefined>();
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setmaxIndex] = useState(0);

  const fetchNovelsByIndex = (index: number) => {
    if (plugin) {
      setLoading(true);
      plugin
        .popularNovels(index, { filters: filterValues })
        .then(res => {
          if (res.length !== 0) {
            setCurrentIndex(index);
            if (index > maxIndex) {
              setmaxIndex(index);
            }
            setNovels(res);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    // Reset when changing plugins.
    setCurrentIndex(0);
    setmaxIndex(0);
    setNovels([]);

    if (plugin?.filters) {
      let filters = {};
      for (const fKey in plugin.filters) {
        filters[fKey] = {
          type: plugin.filters[fKey].type,
          value: plugin.filters[fKey].value,
        };
      }
      setFilterValues(filters);
    }
  }, [plugin]);
  return (
    <AccordionContainer title="Popular Novels" loading={loading}>
      <Stack direction={'row'} spacing={2}>
        <Button
          disabled={plugin === undefined}
          onClick={() => fetchNovelsByIndex(1)}
          variant="contained"
        >
          Fetch
        </Button>
        <Button
          disabled={currentIndex === 0}
          variant="outlined"
          onClick={() => fetchNovelsByIndex(currentIndex + 1)}
        >
          Next Page
        </Button>
        <ToggleButtonGroup
          value={currentIndex}
          exclusive
          onChange={(event, value) => fetchNovelsByIndex(value)}
        >
          {Array.from({ length: maxIndex }, (_, index) => index + 1).map(
            number => (
              <ToggleButton key={number} value={number}>
                {number}
              </ToggleButton>
            ),
          )}
        </ToggleButtonGroup>
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
