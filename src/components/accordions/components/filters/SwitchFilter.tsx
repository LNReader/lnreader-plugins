import React from 'react';
import { Filter, FilterTypes, ValueOfFilter } from '@libs/filterInputs';
import { FormControl, InputLabel, Switch } from '@mui/material';
import { Label } from '@mui/icons-material';

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
  return (
    <React.Fragment key={key}>
      <InputLabel
        id={`filter_label_${filter.label.replace(/\s+/gi, '-')}_${key}`}
      >
        {filter.label}
      </InputLabel>
      <Switch onChange={() => set(!value)} checked={value} />
    </React.Fragment>
  );
};
