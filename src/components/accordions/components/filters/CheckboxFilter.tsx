import React from 'react';
import { Filter, FilterTypes, ValueOfFilter } from '@libs/filterInputs';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
} from '@mui/material';

type FilterType = FilterTypes.CheckboxGroup;

export const CheckboxFilter = ({
  filter: { key, filter },
  value,
  set,
}: {
  filter: { key: string; filter: Filter<FilterType> };
  value: ValueOfFilter<FilterType>;
  set: (v: typeof value) => void;
}) => {
  const label = filter.label.replace(/s+/gi, '-');
  return (
    <FormControl key={key} variant="outlined">
      <FormLabel>{filter.label}</FormLabel>
      <Grid
        container
        columns={{ xs: 3 }}
        id={`checkbox_filter_${key}_${label}`}
      >
        {filter.options.map(option => {
          return (
            <Grid
              key={`${key}_${option.label}`}
              id={`checkbox_filter_option_${key}_${option.value.replace(/\s+/gi, '-')}`}
              item
              xs={1}
              justifyContent={'center'}
              display={'flex'}
            >
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => {
                        set(
                          value.includes(option.value)
                            ? value.filter(q => q !== option.value)
                            : [...value, option.value],
                        );
                      }}
                      checked={value.includes(option.value)}
                    />
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
