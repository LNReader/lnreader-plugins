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
  const label = filter.label.replace(/s+/gi, '-');
  return (
    <FormControl
      key={key}
      variant="filled"
      fullWidth
      margin="dense"
      style={{ alignSelf: 'center' }}
    >
      <InputLabel id={`picker_filter_label_${label}_${key}`}>
        {filter.label}
      </InputLabel>
      <Select
        size="medium"
        labelId={`picker_filter_label_${label}_${key}`}
        id={`picker_filter_${label}_${key}`}
        value={value || key}
        onChange={({ target: { value: newValue } }) => {
          if (newValue === key) newValue = '';
          set(newValue);
        }}
        MenuProps={{ slotProps: { paper: { sx: { maxHeight: 36 * 4 } } } }}
        label={filter.label}
      >
        {filter.options.map(option => {
          return (
            <MenuItem
              style={{ minHeight: 36 }}
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
