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
  en?: LanguageValue;
  es?: LanguageValue;
  en_ca?: LanguageValue;
}

let cultureOrder: Array<SupportedLanguage> = ['en', 'es', 'en_ca'];

export function SetLanguagePreference(order: Array<SupportedLanguage>) {
  cultureOrder = order;
}

/**
 * ATTENTION!!!! This is a generated file (by react-native-strings), DO NOT EDIT
 */
export function BuildString(template: StringSourceSpec, args?: {[key: string]: any}) {
  const bestTemplate = cultureOrder.find(c => template[c]);
  if (!bestTemplate) {
    return MissingStringValue;
  }
  const { literals, substitutions } = <LanguageValue>template[bestTemplate];
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
        return BuildString({"en":{"literals":["GasBuddy"]}});
      },
      Name(templateArgs?: {
        name: string,
      }): string {
        return BuildString({"en":{"literals":["Hello, ","."],"substitutions":["name"]}}, templateArgs);
      },
      Button: {
        OK(): string {
          return BuildString({"en":{"literals":["OK"]}});
        },
      },
    },
    Count: {
      ZeroOneMore(templateArgs?: {
        count: number,
      }): string {
      const count = templateArgs?.count || 0;
      if (count === 0) {
        return BuildString({"en":{"literals":["You have no messages"]}}, templateArgs);
      }
      if (count === 1) {
        return BuildString({"en":{"literals":["You have 1 message"]}}, templateArgs);
      }
      return BuildString({"en":{"literals":["You have "," messages"],"substitutions":["count"]}}, templateArgs);  },
    },
};
