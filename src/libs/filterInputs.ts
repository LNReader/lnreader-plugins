export interface FilterOption {
  readonly label: string;
  readonly value: string;
  readonly subFilters?: Filters;
}

export enum FilterTypes {
  TextInput = 'Text',
  Picker = 'Picker',
  CheckboxGroup = 'Checkbox',
  Switch = 'Switch',
  ExcludableCheckboxGroup = 'XCheckbox',
}

interface SwitchFilter {
  type: FilterTypes.Switch;
  /** Default value */
  value: boolean;
}

interface TextFilter {
  type: FilterTypes.TextInput;
  /** Default value */
  value: string;
}

interface CheckboxFilter {
  type: FilterTypes.CheckboxGroup;
  options: readonly FilterOption[];
  /** Default value */
  value: string[];
}
interface PickerFilter {
  type: FilterTypes.Picker;
  options: readonly FilterOption[];
  /** Default value */
  value: string;
}

interface ExcludableCheckboxFilter {
  type: FilterTypes.ExcludableCheckboxGroup;
  options: readonly FilterOption[];
  value: { include?: string[]; exclude?: string[] };
}

export type Filters = Record<
  string,
  { label: string } & (
    | PickerFilter
    | CheckboxFilter
    | TextFilter
    | SwitchFilter
    | ExcludableCheckboxFilter
  )
>;

export type FilterToValues<
  T extends Record<string, { type: FilterTypes }> | undefined,
> = T extends undefined
  ? undefined
  : {
      [K in keyof T]: Omit<
        { type: NonNullable<T>[K]['type'] } & Filters[string],
        'label' | 'options'
      >;
    };

export type ValueOfFilter<T extends FilterTypes> =
  T extends FilterTypes.CheckboxGroup
    ? CheckboxFilter['value']
    : T extends FilterTypes.Picker
      ? PickerFilter['value']
      : T extends FilterTypes.Switch
        ? SwitchFilter['value']
        : T extends FilterTypes.TextInput
          ? TextFilter['value']
          : T extends FilterTypes.ExcludableCheckboxGroup
            ? ExcludableCheckboxFilter['value']
            : never;
