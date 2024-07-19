import React from 'react';
import { Filter, FilterTypes, ValueOfFilter } from '@libs/filterInputs';
import { FormControl, FormControlLabel, FormLabel, Grid } from '@mui/material';
import { useAppStore } from '@store';
import { TriStateCheckbox, TriStateCheckboxState } from './TriStateCheckbox';
import { TriStateSwitch } from './TriStateSwitch';

type FilterType = FilterTypes.ExcludableCheckboxGroup;

export const XCheckboxFilter = ({
  filter: { key, filter },
  value,
  set,
}: {
  filter: { key: string; filter: Filter<FilterType> };
  value: ValueOfFilter<FilterType>;
  set: (v: typeof value) => void;
}) => {
  const useSwitches = useAppStore(state => state.useSwitches);

  const getCheckboxState = (v: string): TriStateCheckboxState => {
    if (value.include?.includes(v)) return 'checked';
    if (value.exclude?.includes(v)) return 'unchecked';
    return 'neutral';
  };

  const handleChange = (key: string, v: TriStateCheckboxState) => {
    console.log(`setting ${key} to`, v);
    if (v === 'unchecked')
      return set({
        exclude: value.exclude
          ? Array.from(new Set([...value.exclude, key]))
          : [key],
        include: value.include?.filter(f => f !== key),
      });
    if (v === 'checked')
      return set({
        include: value.include
          ? Array.from(new Set([...value.include, key]))
          : [key],
        exclude: value.exclude?.filter(f => f !== key),
      });
    return set({
      include: value.include?.filter(f => f !== key),
      exclude: value.exclude?.filter(f => f !== key),
    });
  };

  return (
    <FormControl key={key} variant="outlined">
      <FormLabel>{filter.label}</FormLabel>
      <Grid container columns={{ xs: 3 }}>
        {filter.options.map(option => {
          return (
            <Grid
              key={`${key}_${option.label}`}
              item
              xs={1}
              justifyContent={'center'}
              display={'flex'}
            >
              <FormControl>
                <FormControlLabel
                  labelPlacement={useSwitches ? 'top' : 'end'}
                  style={{ userSelect: 'none' }}
                  control={
                    useSwitches ? (
                      <TriStateSwitch
                        value={getCheckboxState(option.value)}
                        onChange={c => handleChange(option.value, c)}
                      />
                    ) : (
                      <TriStateCheckbox
                        value={getCheckboxState(option.value)}
                        onChange={c => handleChange(option.value, c)}
                      />
                    )
                  }
                  label={option.label}
                />
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
    </FormControl>
  );
};
