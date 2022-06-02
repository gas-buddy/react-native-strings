/* eslint-disable prettier/prettier, quotes */
declare var __DEV__: boolean;

const MissingStringValue = (typeof __DEV__ !== 'undefined' && __DEV__) ? '💀Missing String💀' : '';

export type SupportedLanguage = 'en' | 'es' | 'en_ca';

export const SupportedLanguages = ['en', 'es', 'en_ca'];

export interface LanguageValue {
  literals: Array<string>;
  substitutions?: Array<string>;
}

export interface StringSourceSpec {
  key: string;
  en?: LanguageValue;
  es?: LanguageValue;
  en_ca?: LanguageValue;
}

let cultureOrder: Array<SupportedLanguage> = ['en', 'es', 'en_ca'];

export function SetLanguagePreference(order: Array<SupportedLanguage>) {
  cultureOrder = order;
}

/**
 * The transformer can be useful for debugging, to find non-l10 strings or those that don't handle
 * potential size changes well
 */
let transformer: undefined | ((key: string, input: LanguageValue) => LanguageValue | string);

export function SetL10NTransformer(transformerFunction?: (key: string, input: LanguageValue) => LanguageValue | string) {
  transformer = transformerFunction;
}

/**
 * ATTENTION!!!! This is a generated file (by react-native-strings), DO NOT EDIT
 */
export function BuildString(template: StringSourceSpec, args?: {[key: string]: any}) {
  const bestTemplate = cultureOrder.find(c => template[c]);
  if (!bestTemplate) {
    return MissingStringValue;
  }
  let parsedTemplate = <LanguageValue>template[bestTemplate];
  if (transformer) {
    const xformed = transformer(template.key, parsedTemplate);
    if (typeof xformed === 'string') {
      return xformed;
    }
    parsedTemplate = xformed;
  }
  const { literals, substitutions } = parsedTemplate;
  if (args) {
    const finalString = [];
    for (let i = 0, len = literals.length; i < len; i += 1) {
      finalString.push(literals[i], substitutions?.[i] ? args[substitutions[i]] : '');
    }
    return finalString.join('');
  } else {
    return literals[0];
  }
}

export const Strings = {
    Common: {
      GasBuddy(): string {
        return BuildString({"key":"Common.GasBuddy","en":{"literals":["GasBuddy"]}});
      },
      Name(templateArgs?: {
        name: string,
      }): string {
        return BuildString({"key":"Common.Name","en":{"literals":["Hello, ","."],"substitutions":["name"]},"es":{"literals":["Hola, ","."],"substitutions":["name"]}}, templateArgs);
      },
      Button: {
        OK(): string {
          return BuildString({"key":"Common.Button.OK","en":{"literals":["OK"]}});
        },
      },
    },
    Count: {
      ZeroOneMore(templateArgs?: {
        count: number,
      }): string {
      const count = templateArgs?.count || 0;
      if (count === 0) {
        return BuildString({"key":"Count.ZeroOneMore","en":{"literals":["You have no messages"]}}, templateArgs);
      }
      if (count === 1) {
        return BuildString({"key":"Count.ZeroOneMore","en":{"literals":["You have 1 message"]}}, templateArgs);
      }
      return BuildString({"key":"Count.ZeroOneMore","en":{"literals":["You have "," messages"],"substitutions":["count"]}}, templateArgs);  },
    },
};
