/* eslint-disable */
import fs from 'fs';

export function file2array<T>(
  file: string,
  deserializer: (s: string) => T,
  separator = '\n'
): T[] {
  const arr = fs
    .readFileSync(file)
    .toString()
    .split(separator)
    .map((s) => deserializer(s));

  arr.pop();

  return arr;
}
