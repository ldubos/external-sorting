/* eslint-disable */
import fs from 'fs';

export function file2array<T>(
  file: string,
  deserializer: (s: string) => T,
  separator = '\n'
): T[] {
  const arr: string[] = fs
    .readFileSync(file)
    .toString()
    .split(separator);

  arr.pop();

  return arr.map((s) => deserializer(s));
}
