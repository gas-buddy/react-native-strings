export interface StringInAnyLanguage {
  [language: string]: string;
}

export interface StringWithAnyOrdinal {
  [ordinal: number]: StringInAnyLanguage;
  default?: StringInAnyLanguage;
}

export interface TemplateArgumentType {
  name: string;
  type: string;
}

export interface StringsFileEntry {
  key: string;
  args?: Array<TemplateArgumentType>;
  type: 'string' | undefined;
}

export interface CountedStringsFileEntry {
  key: string;
  type: 'counted';
  args?: Array<TemplateArgumentType>;
  values: StringWithAnyOrdinal;
}

export interface StringsFileContent {
  title: string;
  baseName?: string;
  entries: Array<StringsFileEntry | CountedStringsFileEntry>;
}
