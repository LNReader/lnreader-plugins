import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import {
  AnyFilterValue,
  Filters,
  FilterToValues,
  FilterTypes,
} from '@libs/filterInputs';
import { PickerFilter } from './PickerFilter';
import { SwitchFilter } from './SwitchFilter';
import { TextFilter } from './TextFilter';
import { CheckboxFilter } from './CheckboxFilter';
import { XCheckboxFilter } from './XCheckboxFilter';

const renderFilters = (
  filters: Filters | undefined,
  values: FilterToValues<Filters> | undefined,
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
          case FilterTypes.TextInput: {
            const value = values[key].value;
            if (!isValueCorrectType(value, filter.value)) {
              console.error(
                `FilterValue for filter [${key}] has a wrong type!`,
              );
              return null;
            }
            return (
              <TextFilter
                filter={{ key, filter }}
                set={newValue => set(key, newValue)}
                value={value}
                key={`text_filter_${key}`}
              />
            );
          }
          case FilterTypes.CheckboxGroup: {
            const value = values[key].value;
            if (!isValueCorrectType(value, filter.value)) {
              console.error(
                `FilterValue for filter [${key}] has a wrong type!`,
              );
              return null;
            }
            return (
              <CheckboxFilter
                filter={{ key, filter }}
                set={newValue => set(key, newValue)}
                value={value}
                key={`checkbox_filter_${key}`}
              />
            );
          }
          case FilterTypes.ExcludableCheckboxGroup: {
            const value = values[key].value;
            if (!isValueCorrectType(value, filter.value)) {
              console.error(
                `FilterValue for filter [${key}] has a wrong type!`,
              );
              return null;
            }
            return (
              <XCheckboxFilter
                filter={{ key, filter }}
                set={newValue => set(key, newValue)}
                value={value}
                key={`checkbox_filter_${key}`}
              />
            );
          }
        }
      })}
    </>
  );
};

export type DialogRef = { show(): void; hide(): void };

export const FiltersDialog = forwardRef<
  DialogRef,
  {
    values: FilterToValues<Filters> | undefined;
    filters: Filters | undefined;
    setValues: React.Dispatch<
      React.SetStateAction<FilterToValues<Filters> | undefined>
    >;
    refetch(): void;
  }
>(function FiltersDialog({ values, setValues, filters, refetch }, ref) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterElements, setFilterElements] = useState<ReactNode>(false);
  const setFilterWithKey = (key: string, newValue: AnyFilterValue) =>
    setValues(fValues =>
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

  useImperativeHandle(ref, () => ({
    show() {
      setDialogOpen(true);
    },
    hide() {
      setDialogOpen(false);
    },
  }));

  useEffect(() => {
    setFilterElements(renderFilters(filters, values, setFilterWithKey));
  }, [values]);

  return (
    <Dialog
      scroll="paper"
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
    >
      <DialogTitle>Filters</DialogTitle>
      <DialogContent dividers id="filtersContent">
        {filterElements}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => refetch()}>Refetch</Button>
        <Button style={{ color: 'red' }} onClick={() => setDialogOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});
