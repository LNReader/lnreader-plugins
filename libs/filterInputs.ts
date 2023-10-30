export interface FilterValue {
    label: string;
    value: string | number;
}
export type FilterInputs = string | "TextInput" | "Picker" | "CheckBox";
export interface Filter {
    key: string;
    label: string;
    values: FilterValue[];
    inputType: FilterInputs;
}
