#!/usr/bin/env node
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import assert from 'assert';
import mkdirp from 'mkdirp';
import minimist from 'minimist';
import TypescriptStringBuilder from './index';

const argv = minimist(process.argv.slice(2));
const [sourceDirectory, destinationFilename] = argv._;

const usage = `
USAGE:
  npx react-native-strings <source-directory> <destination-filename-or-directory> [--locales=<supported_locales>] [--json]
`;

assert(sourceDirectory, usage);
assert(destinationFilename, usage);

const stringBuilder = new TypescriptStringBuilder(argv.locales || 'en');

const files = glob.sync('**/*.yaml', { cwd: path.resolve(sourceDirectory) });
files.forEach((file) => stringBuilder.addFromFile(path.join(sourceDirectory, file)));

function writeIfChanged(filename: string, content: string) {
  const existing = fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : '';
  if (existing !== content) {
    fs.writeFileSync(filename, content, 'utf8');
  }
}

if (argv.json) {
  stringBuilder.locales.forEach((locale) => {
    mkdirp.sync(destinationFilename);
    const jsonFile = stringBuilder.generateJson(locale);
    const outpath = path.join(destinationFilename, `${locale}.json`);
    writeIfChanged(outpath, jsonFile);
  });
} else {
  mkdirp.sync(path.dirname(destinationFilename));
  const stringsFile = stringBuilder.generate();
  writeIfChanged(destinationFilename, stringsFile);
}
