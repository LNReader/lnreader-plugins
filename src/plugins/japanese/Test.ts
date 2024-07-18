import { Plugin } from '@typings/plugin';
import { FilterTypes, Filters } from '@libs/filterInputs';

class FilterTest implements Plugin.PluginBase {
  customJS?: string | undefined;
  customCSS?: string | undefined;
  imageRequestInit?: Plugin.ImageRequestInit | undefined;
  webStorageUtilized?: boolean | undefined;
  async searchNovels(): Promise<Plugin.NovelItem[]> {
    return [];
  }
  resolveUrl?(): string {
    return '';
  }
  id = 'filter.test';
  name = 'FilterTest';
  icon = 'src/jp/syosetu/icon.png';
  site = 'example.com';
  novelPrefix = 'example.com';
  version = '0.1';
  headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  async popularNovels(): Promise<Plugin.NovelItem[]> {
    return [];
  }
  async parseNovel(): Promise<Plugin.SourceNovel> {
    return { name: '', path: '' };
  }
  async parseChapter(): Promise<string> {
    return '';
  }

  filters = {
    pickerTest: {
      type: FilterTypes.Picker,
      label: 'Picker',
      options: [
        { label: 'Empty', value: '' },
        { label: 'Option1', value: 'value1' },
        { label: 'Option2', value: 'value2' },
      ],
      value: '',
    },
    picker_CD_Test: {
      type: FilterTypes.Picker,
      label: 'Picker with changed default',
      options: [
        { label: 'Empty', value: '' },
        { label: 'Option1', value: 'value1' },
        { label: 'Option2', value: 'value2' },
      ],
      value: 'value1',
    },
    checkboxTest: {
      type: FilterTypes.CheckboxGroup,
      label: 'CheckboxGroup',
      options: [
        { label: 'Checkbox1', value: '' },
        { label: 'Checkbox2', value: 'value1' },
        { label: 'Checkbox3', value: 'value2' },
        { label: 'Checkbox4', value: 'value3' },
        { label: 'Checkbox5', value: 'value4' },
      ],
      value: [],
    },
    checkbox_CD_Test: {
      type: FilterTypes.CheckboxGroup,
      label: 'CheckboxGroup with changed default',
      options: [
        { label: 'Checkbox1', value: '' },
        { label: 'Checkbox2', value: 'value1' },
        { label: 'Checkbox3', value: 'value2' },
        { label: 'Checkbox4', value: 'value3' },
        { label: 'Checkbox5', value: 'value4' },
      ],
      value: ['value1', 'value3'],
    },
    xCheckboxTest: {
      type: FilterTypes.ExcludableCheckboxGroup,
      label: 'ExCheckboxGroup',
      options: [
        { label: 'Checkbox1', value: '' },
        { label: 'Checkbox2', value: 'value1' },
        { label: 'Checkbox3', value: 'value2' },
        { label: 'Checkbox4', value: 'value3' },
        { label: 'Checkbox5', value: 'value4' },
      ],
      value: {},
    },
    xCheckbox_CD_Test: {
      type: FilterTypes.ExcludableCheckboxGroup,
      label: 'ExCheckboxGroup with changed default',
      options: [
        { label: 'Checkbox1', value: '' },
        { label: 'Checkbox2', value: 'value1' },
        { label: 'Checkbox3', value: 'value2' },
        { label: 'Checkbox4', value: 'value3' },
        { label: 'Checkbox5', value: 'value4' },
      ],
      value: { exclude: ['value1'], include: [''] },
    },
    switch_On_Test: {
      type: FilterTypes.Switch,
      label: 'Switch on by default',
      value: true,
    },
    switch_Off_Test: {
      type: FilterTypes.Switch,
      label: 'Switch off by default',
      value: true,
    },
    textTest: {
      type: FilterTypes.TextInput,
      label: 'TextInput',
      value: '',
    },
    text_CD_Test: {
      type: FilterTypes.TextInput,
      label: 'TextInput with changed default',
      value: 'Some value',
    },
  } satisfies Filters;
}

export default new FilterTest();
