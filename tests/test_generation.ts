import fs from 'fs';
import tap from 'tap';
import path from 'path';
// TODO not sure why I can't run against src...
import Generator from '../build/index';
import { Strings } from './snapshots/strings';

tap.test('test_generation', (test) => {
  const gen = new Generator('en,es,en-CA');
  test.ok(gen, 'Should create a generator');
  gen.addFromFile(path.resolve(__dirname, './strings/common.yaml'));
  gen.addFromFile(path.resolve(__dirname, './strings/count.yaml'));
  const output = gen.generate();
  const snapshot = fs.readFileSync(path.resolve(__dirname, './snapshots/strings.ts'), 'utf8');
  test.strictEquals(output, snapshot, 'Expected unchanged output');

  test.strictEquals(Strings.Common.Button.OK(), 'OK', 'Should resolve a simple value');
  test.strictEquals(
    Strings.Count.ZeroOneMore({ count: 0 }),
    'You have no messages',
    'Should resolve a counted value',
  );
  test.strictEquals(
    Strings.Count.ZeroOneMore({ count: 1 }),
    'You have 1 message',
    'Should resolve a counted value',
  );
  test.strictEquals(
    Strings.Count.ZeroOneMore({ count: 4 }),
    'You have 4 messages',
    'Should resolve a counted value',
  );
  test.end();
});
