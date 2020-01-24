#!/usr/bin/env node

/* eslint-disable*/
const stream = require('stream');
const ck = require('chalk');
const esort = require('../dist/external-sorting').default;

if (
  typeof process.argv[2] !== 'string' ||
  typeof process.argv[3] !== 'string'
) {
  process.stderr.write(
    ck.redBright(`usage: ${__filename} [entity type] [nbr of entities]\n`)
  );
  process.exit(1);
}

const entityType = process.argv[2].toLowerCase();
const nbrOfEntities = parseInt(process.argv[3], 10);

if (['number', 'string', 'object'].indexOf(entityType) === -1) {
  process.stderr.write(
    ck.redBright(`entity type must be one of: number, string or object\n`)
  );
  process.exit(1);
}

const input = new stream.Readable();
const output = new stream.Writable({
  write() {}
});
let deserializer = (s) => s;
let serializer = (v) => v;
let sortBy;
let generator;

switch (entityType) {
  case 'number':
    deserializer = (s) => Number(s);
    serializer = (v) => v.toString(10);
    generator = () => `${Math.random() * Number.MAX_SAFE_INTEGER}\n`;
    break;
  case 'string':
    generator = () =>
      `${(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)}\n`;
    break;
  case 'object':
    deserializer = (s) => JSON.parse(s.replace(/\u0000/g, ''));
    serializer = JSON.stringify;
    generator = () =>
      `{"index":${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}}\n`;
    sortBy = (v) => v.index;
    break;
}

const sortInstance = esort({
  input,
  output,
  tempDir: __dirname,
  deserializer,
  serializer,
  maxHeap: 10000
});

sortInstance
  .asc(sortBy)
  .then(() => {
    process.stdout.write(ck.greenBright('DONE\n'));
    process.exit(0);
  })
  .catch((err) => {
    process.stderr.write(ck.redBright(err.message) + '\n');
    process.exit(1);
  });

for (let i = 0; i < nbrOfEntities; ) {
  let buffer = '';

  for (
    let c = 0;
    c < Math.floor(nbrOfEntities / 100) && i < nbrOfEntities;
    c++
  ) {
    buffer += generator();
    i++;
  }

  input.push(Buffer.from(buffer, 'utf8'));
}

input.emit('end');
input.emit('close');
