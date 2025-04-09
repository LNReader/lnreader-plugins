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
import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import AccordionContainer from '../components/AccordionContainer';
import { Plugin } from '@typings/plugin';
import NovelItemCard from '../components/NovelItemCard';
import { Filters, FilterToValues } from '@libs/filterInputs';
import { useAppStore } from '@store';
import './index.css';
import { DialogRef, FiltersDialog } from '../components/filters/FiltersDialog';

export default function PopularNovels() {
  const plugin = useAppStore(state => state.plugin);
  const [novels, setNovels] = useState<Plugin.NovelItem[]>([]);
  const [filterValues, setFilterValues] = useState<
    FilterToValues<Filters> | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isLatest, setIsLatest] = useState(true);
  const dialogRef = useRef<DialogRef>(null);

  const fetchNovelsByIndex = async (index: number) => {
    if (plugin && index) {
      setLoading(true);
      const novels = await plugin.popularNovels(index, {
        filters: filterValues || {},
        showLatestNovels: isLatest,
      });
      if (novels.length !== 0) {
        setCurrentIndex(index);
        if (index > maxIndex) {
          setMaxIndex(index);
        }
        setNovels(novels);
      }
      setLoading(false);
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
    // TODO: Fix crashing on plugin change!
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
    <AccordionContainer title="Popular Novels" loading={loading}>
      <Stack
        direction={'row'}
        useFlexGap
        sx={{ flexWrap: 'wrap' }}
        spacing={2}
        alignItems={'center'}
      >
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
        <Button
          disabled={!plugin || isLatest || !plugin.filters}
          onClick={() => {
            dialogRef.current?.show();
          }}
        >
          Filters
        </Button>
        <FiltersDialog
          ref={dialogRef}
          values={filterValues}
          filters={plugin?.filters}
          setValues={setFilterValues}
          refetch={() => fetchNovelsByIndex(1)}
        />
        <ToggleButtonGroup
          value={currentIndex}
          exclusive
          onChange={(_event, value) => fetchNovelsByIndex(value)}
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
          display: 'flex',
        }}
      >
        {novels.map((novel, index) => (
          <NovelItemCard key={'novelItem_' + index} item={novel} />
        ))}
      </Box>
    </AccordionContainer>
  );
}
