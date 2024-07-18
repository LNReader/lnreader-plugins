import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  FormGroup,
  Dialog,
  FormControl,
  Grid,
} from '@mui/material';
import React, { useEffect, useState, ChangeEvent, ReactNode } from 'react';
import AccordionContainer from '../components/AccordionContainer';
import { Plugin } from '@typings/plugin';
import NovelItemCard from '../components/NovelItemCard';
import {
  Filters,
  FilterToValues,
  FilterTypes,
  AnyFilterValue,
} from '@libs/filterInputs';
import { useAppStore } from '@store';
import './index.css';
import { PickerFilter } from '../components/filters/PickerFilter';
import { SwitchFilter } from '../components/filters/SwitchFilter';

const renderFilters = (
  filters: Filters | undefined,
  values: FilterToValues<Filters | undefined> | undefined,
  set: (key: string, v: AnyFilterValue) => void,
): React.ReactNode => {
  const isValueCorrectType = <T extends AnyFilterValue>(
    o: AnyFilterValue,
    f: T,
  ): o is T => {
    const checkIfIsCorrectObjectType = (o: AnyFilterValue, f: T): o is T => {
      const areArrays = Array.isArray(o) && Array.isArray(f);
      const areObjects = typeof o === 'object' && typeof f === 'object';
      return areArrays || areObjects;
    };
    return typeof o === typeof f || checkIfIsCorrectObjectType(o, f);
  };

  if (!filters || !values) return false;
  return (
    <>
      <b>Filters:</b>
      {Object.entries(filters).map(([key, filter]) => {
        if (!(key in values)) {
          console.error(`No filter value for ${key} in filter values!`);
          return null;
        }
        switch (filter.type) {
          case FilterTypes.Picker: {
            // Check if filterValues have correct type
            // this needs to be inside of every case in this switch to get correct value type
            const value = values[key].value; // here value has every possible value type
            // We could just do `as typeof filter.value` but just to be sure I made a typeguard
            if (!isValueCorrectType<typeof filter.value>(value, filter.value)) {
              console.error(
                `FilterValue for filter [${key}] has a wrong type!`,
              );
              return null;
            }
            // value; // here value has only Picker's value
            return (
              <PickerFilter
                key={`picker_filter_${key}`}
                filter={{ key, filter }}
                value={value}
                set={newValue => set(key, newValue)}
              />
            );
          }
          case FilterTypes.Switch: {
            // Check if filterValues have correct type
            // this needs to be inside of every case in this switch to get correct value type
            const value = values[key].value; // here value has every possible value type
            // We could just do `as typeof filter.value` but just to be sure I made a typeguard
            if (!isValueCorrectType<typeof filter.value>(value, filter.value)) {
              console.error(
                `FilterValue for filter [${key}] has a wrong type!`,
              );
              return null;
            }
            // value; // here value has only Picker's value
            return (
              <SwitchFilter
                filter={{ key, filter }}
                key={`switch_filter_${key}`}
                value={value}
                set={newValue => set(key, newValue)}
              />
            );
          }
          default:
            return (
              <FormControl
                key={key}
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
              >
                <b>{filter.type} filters not yet implemented!</b>
              </FormControl>
            );
        }
      })}
    </>
  );
};

export default function PopularNovels() {
  const plugin = useAppStore(state => state.plugin);
  const [novels, setNovels] = useState<Plugin.NovelItem[]>([]);
  const [filterValues, setFilterValues] = useState<
    FilterToValues<Filters | undefined> | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isLatest, setIsLatest] = useState(true);
  const [filterDialogOpen, setFilterDialog] = useState(false);
  const [filterElements, setFilterElements] = useState<ReactNode>(false);

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

  const setFilterWithKey = (key: string, newValue: AnyFilterValue) =>
    setFilterValues(fValues =>
      !fValues
        ? fValues
        : {
            ...fValues,
            [key]: {
              ...fValues[key],
              value: newValue,
            },
          },
    );

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
      // initial set of elements to avoid errors when changing plugins
      setFilterElements(
        renderFilters(plugin?.filters, filters, setFilterWithKey),
      );
    }
  }, [plugin]);

  useEffect(() => {
    setFilterElements(
      renderFilters(plugin?.filters, filterValues, setFilterWithKey),
    );
  }, [filterValues]);

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
        <Button disabled={!plugin} onClick={() => setFilterDialog(true)}>
          Filters
        </Button>
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialog(false)}>
          <div id="filtersContent">
            {filterElements}
            <Grid gridAutoFlow={'column'}>
              <Button
                style={{ color: '#00aa  00ff' }}
                onClick={() => fetchNovelsByIndex(1)}
              >
                Refetch
              </Button>
              <Button
                style={{ color: 'red' }}
                onClick={() => setFilterDialog(false)}
              >
                Close
              </Button>
            </Grid>
          </div>
        </Dialog>
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
