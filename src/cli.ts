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
  npx react-native-strings <source-directory> <destination-filename> [--locales=<supported_locales>]
`;

assert(sourceDirectory, usage);
assert(destinationFilename, usage);

mkdirp.sync(path.dirname(destinationFilename));

const stringBuilder = new TypescriptStringBuilder(argv.locales || 'en');

const files = glob.sync('**/*.yaml', { cwd: path.resolve(sourceDirectory) });
files.forEach((file) => stringBuilder.addFromFile(path.join(sourceDirectory, file)));

const stringsFile = stringBuilder.generate();

const exFile = fs.existsSync(destinationFilename)
  ? fs.readFileSync(destinationFilename, 'utf8')
  : '';

if (exFile !== stringsFile) {
  fs.writeFileSync(destinationFilename, stringsFile, 'utf8');
}
