import React from 'react';
import { Filter, FilterTypes, ValueOfFilter } from '@libs/filterInputs';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type FilterType = FilterTypes.Picker;

export const PickerFilter = ({
  filter: { key, filter },
  value,
  set,
}: {
  filter: { key: string; filter: Filter<FilterType> };
  value: ValueOfFilter<FilterType>;
  set: (v: ValueOfFilter<FilterType>) => void;
}) => {
  return (
    <FormControl key={key} variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel
        id={`filter_label_${filter.label.replace(/\s+/gi, '-')}_${key}`}
      >
        {filter.label}
      </InputLabel>
      <Select
        labelId={`filter_label_${filter.label.replace(/\s+/gi, '-')}_${key}`}
        id={`picker_filter_${filter.label.replace(/\s+/gi, '-')}_${key}`}
        value={value || key}
        onChange={({ target: { value: newValue } }) => {
          if (newValue === key) newValue = '';
          set(newValue);
        }}
        label={filter.label}
      >
        {filter.options.map(option => {
          return (
            <MenuItem
              key={`${key}_${option.value}`}
              value={
                /** Because Mui treats empty string as `empty value`
                 * and doesn't show the MenuItem, if the value is empty, just use the key...
                 * We could do some other weird stuff, but I doubt there will be a filter
                 * that has the same name as the value being used inside of it.
                 * We can warn people in the documentation about this behavior */
                option.value || key
              }
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
