import React, { useRef } from 'react';
import { Filter, FilterTypes, ValueOfFilter } from '@libs/filterInputs';
import { FormControl, TextField } from '@mui/material';

type FilterType = FilterTypes.TextInput;

export const TextFilter = ({
  filter: { key, filter },
  value,
  set,
}: {
  filter: { key: string; filter: Filter<FilterType> };
  value: ValueOfFilter<FilterType>;
  set: (v: typeof value) => void;
}) => {
  const label = filter.label.replace(/s+/gi, '-');
  const textRef = useRef<HTMLInputElement>(null);
  return (
    <FormControl key={key} className="switch_filter">
      <TextField
        color="primary"
        id={`text_filter_${label}_${key}`}
        inputRef={textRef}
        label={filter.label}
        value={value}
        type="text"
        variant="filled"
        fullWidth
        margin="dense"
        onInput={() => {
          if (textRef.current) {
            set(textRef.current.value ?? '');
          }
        }}
      />
    </FormControl>
  );
};
