export interface FilterValue {
    label: string;
    value: string;
}
export enum FilterInputs {
    TextInput,
    Picker,
    Checkbox,
}
export interface Filter {
    key: string;
    label: string;
    values: FilterValue[];
    inputType: FilterInputs;
}
