import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  FormGroup,
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
  const [maxIndex, setMaxIndex] = useState(0);
  const [isLatest, setIsLatest] = useState(true);

  const fetchNovelsByIndex = (index: number) => {
    if (plugin && index) {
      setLoading(true);
      plugin
        .popularNovels(index, {
          filters: filterValues,
          showLatestNovels: isLatest,
        })
        .then(res => {
          if (res.length !== 0) {
            setCurrentIndex(index);
            if (index > maxIndex) {
              setMaxIndex(index);
            }
            setNovels(res);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handleSwitchLatestChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsLatest(event.target.checked);
  };

  useEffect(() => {
    if (plugin) {
      setCurrentIndex(1);
      setMaxIndex(1);
      fetchNovelsByIndex(1);
    }
  }, [isLatest]);

  useEffect(() => {
    // Reset when changing plugins.
    setCurrentIndex(0);
    setMaxIndex(0);
    setNovels([]);

    if (plugin?.filters) {
      const filters = {};
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
      <Stack direction={'row'} spacing={2} alignItems={'center'}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isLatest}
                onChange={handleSwitchLatestChange}
                color="secondary"
              />
            }
            label={<Box minWidth={70}>{isLatest ? 'Latest' : 'Popular'}</Box>}
          />
        </FormGroup>
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
              <ToggleButton key={`novel_page_index_${number}`} value={number}>
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
