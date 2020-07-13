import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import Handlebars from 'handlebars';
import snake from 'lodash.snakecase';
import compile, { CompiledTemplate } from 'es6-template-strings/compile';
import { StringsFileEntry, CountedStringsFileEntry, StringsFileContent } from 'types';

interface TreeNode {
  key: string;
  nodes: Array<TreeNode>;
  strings: Array<any>;
}

interface TreeRoot extends TreeNode {
  locales: Array<string>;
}

function supported(locales: Array<string>, values: any) {
  const compiledValues: { [key: string]: CompiledTemplate } = {};
  locales.forEach((locale) => {
    if (values[locale]) {
      const template = compile(values[locale]);
      if (!template.substitutions?.length) {
        delete template.substitutions;
      }
      compiledValues[locale] = template;
    }
  });
  return compiledValues;
}

export default class TypedStringBuilder {
  locales: Array<string>;
  stringsByKey: { [key: string]: StringsFileEntry | CountedStringsFileEntry } = {};
  template: HandlebarsTemplateDelegate<any>;

  constructor(supportedLocales: string) {
    this.locales = supportedLocales.split(/\s*[\s,]\s*/);
    const handlebars = Handlebars.create();

    this.template = handlebars.compile(
      fs.readFileSync(path.resolve(__dirname, '../templates/class.handlebars'), 'utf8'),
    );
    handlebars.registerPartial(
      'node',
      fs.readFileSync(path.resolve(__dirname, '../templates/node.handlebars'), 'utf8'),
    );
    handlebars.registerHelper('json', (o) => JSON.stringify(o));
    handlebars.registerHelper('snake', (o) => snake(o));
  }

  addFromFile(filename: string) {
    const str = fs.readFileSync(filename, 'utf8');
    this.addFromYamlString(str);
  }

  addFromYamlString(rawYaml: string) {
    const { baseName, entries } = <StringsFileContent>yaml.parse(rawYaml);
    entries.forEach((source) => {
      this.stringsByKey[`${baseName || ''}${baseName ? '.' : ''}${source.key}`] = source;
    });
  }

  generate() {
    const tree: TreeRoot = {
      locales: this.locales,
      key: '',
      nodes: [],
      strings: [],
    };

    Object.entries(this.stringsByKey).forEach(([key, { args, type, ...langs }]) => {
      const keyComponents = key.split('.');
      const node = keyComponents
        .slice(0, keyComponents.length - 1)
        .reduce((treeNode: TreeNode, keyPart) => {
          let exNode = treeNode.nodes.find((n) => n.key === keyPart);
          if (!exNode) {
            exNode = { key: keyPart, nodes: [], strings: [] };
            treeNode.nodes.push(exNode);
          }
          return exNode;
        }, tree);

      const finalArgs = [...(args || [])];

      if (type === 'counted' && !finalArgs.find((a) => a.name === 'count')) {
        finalArgs.push({ name: 'count', type: 'number' });
      }

      if (type === 'counted') {
        const { values } = <CountedStringsFileEntry>langs;
        const value = Object.entries(values).map(([number, ordinalValues]) => ({
          number,
          value: supported(this.locales, ordinalValues),
          isDefault: number === 'default',
        }));
        node.strings.push({
          key: keyComponents[keyComponents.length - 1],
          hasArgs: true,
          args: finalArgs,
          isCounted: true,
          fullKey: key,
          value,
        });
      } else {
        node.strings.push({
          key: keyComponents[keyComponents.length - 1],
          hasArgs: !!finalArgs.length,
          args: finalArgs,
          isCounted: false,
          fullKey: key,
          value: supported(this.locales, langs),
        });
      }

      // TODO can't even remember why this is here...
      (<any>node)[keyComponents[keyComponents.length - 1]] = langs;
    });

    return this.template(tree);
  }
}
