declare module 'es6-template-strings/compile' {
  export interface CompiledTemplate {
    literals: Array<string>;
    substitutions?: Array<string>;
  }

  export default function (template: string): CompiledTemplate;
}
