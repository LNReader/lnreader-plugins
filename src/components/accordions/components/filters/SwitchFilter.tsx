import React from 'react';
import { Filter, FilterTypes, ValueOfFilter } from '@libs/filterInputs';
import { FormControl, FormControlLabel } from '@mui/material';
import { StyledSwitch } from '../../../StyledSwitch';

type FilterType = FilterTypes.Switch;

export const SwitchFilter = ({
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
    <FormControl
      key={key}
      className="switch_filter"
      fullWidth
      variant="outlined"
    >
      <FormControlLabel
        style={{ userSelect: 'none' }}
        label={filter.label}
        id={`switch_filter_${label}_${key}`}
        control={<StyledSwitch onChange={() => set(!value)} />}
      />
    </FormControl>
  );
};
