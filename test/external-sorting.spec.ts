/* eslint-disable */
import fsort from 'fast-sort';
import fs, { promises as fsp } from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import esort from '../src/external-sorting';
import { file2array } from './helpers';

interface IFriend {
  id: number;
  name: string;
}

interface IName {
  first: string;
  last: string;
}

interface ITestObject {
  _id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  eyeColor: string;
  name: IName;
  company: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  registered: string;
  latitude: string;
  longitude: string;
  tags: string[];
  range: number[];
  friends: IFriend[];
  greeting: string;
  favoriteFruit: string;
}

describe('sort', () => {
  const tempDir = path.resolve(__dirname, '.tmp');
  const outputPath = path.resolve(tempDir, 'output');

  const flat10intPath = path.resolve(__dirname, 'arrays', '10_int');
  const flat10intCommaPath = path.resolve(__dirname, 'arrays', '10_int_comma');
  const flat10intCommaAltPath = path.resolve(
    __dirname,
    'arrays',
    '10_int_comma_alt'
  );
  const intParser = (s: string) => parseInt(s, 10);
  const flat10int = file2array(flat10intPath, intParser);
  const flat100intPath = path.resolve(__dirname, 'arrays', '100_int');
  const flat100int = file2array(flat100intPath, intParser);
  const flat100stringPath = path.resolve(__dirname, 'arrays', '100_string');
  const stringParser = (s: string) => s;
  const flat100string = file2array(flat100stringPath, stringParser);
  const flat100objectPath: string = path.resolve(
    __dirname,
    'arrays',
    '100_object'
  );
  const objectParser = (s: string): ITestObject => {
    try {
      return JSON.parse(s);
    } catch (e) {
      return null;
    }
  };
  const flat100object = file2array(flat100objectPath, objectParser);

  beforeEach((done) => {
    rimraf(tempDir, (err1) => {
      if (err1) return done(err1);

      fs.mkdir(tempDir, (err2) => {
        done(err2);
      });
    });
  });

  afterAll((done) => {
    rimraf(tempDir, done);
  });

  it('Should sort flat 10 int array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat10intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      tempDir
    }).asc();

    expect(file2array(outputPath, intParser)).toEqual(fsort(flat10int).asc());
  });

  it('Should sort flat 10 int array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat10intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      tempDir
    }).desc();

    expect(file2array(outputPath, intParser)).toEqual(fsort(flat10int).desc());
  });

  it('Should sort flat 10 int array in asc order with custom delimiter', async () => {
    await esort({
      input: fs.createReadStream(flat10intCommaPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      delimiter: ',',
      tempDir
    }).asc();

    expect(file2array(outputPath, intParser, ',')).toEqual(
      fsort(flat10int).asc()
    );
  });

  it('Should sort flat 10 int array in asc order with custom delimiter and lastDelimiter on false', async () => {
    await esort({
      input: fs.createReadStream(flat10intCommaAltPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      delimiter: ',',
      lastDelimiter: false,
      tempDir
    }).asc();

    expect(file2array(outputPath, intParser, ',')).toEqual(
      fsort(flat10int).asc()
    );
  });

  it('Should sort flat 10 int array in asc order with custom delimiter and input stream encoding set to UTF-8', async () => {
    const inputStream = fs.createReadStream(flat10intCommaPath);

    inputStream.setEncoding('utf8');

    await esort({
      input: inputStream,
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      delimiter: ',',
      tempDir
    }).asc();

    expect(file2array(outputPath, intParser, ',')).toEqual(
      fsort(flat10int).asc()
    );
  });

  it('Should sort flat 10 int array in asc order with custom delimiter and input stream highWaterMark set to 1', async () => {
    const inputStream = fs.createReadStream(flat10intCommaPath, {
      highWaterMark: 1
    });

    await esort({
      input: inputStream,
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      delimiter: ',',
      tempDir
    }).asc();

    expect(file2array(outputPath, intParser, ',')).toEqual(
      fsort(flat10int).asc()
    );
  });

  it('Should sort flat 100 int array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      tempDir
    }).asc();

    expect(file2array(outputPath, intParser)).toEqual(fsort(flat100int).asc());
  });

  it('Should sort flat 100 int array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      tempDir
    }).desc();

    expect(file2array(outputPath, intParser)).toEqual(fsort(flat100int).desc());
  });

  it('Should sort flat 100 int array in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      maxHeap: 10,
      tempDir
    }).asc();

    expect(file2array(outputPath, intParser)).toEqual(fsort(flat100int).asc());
  });

  it('Should sort flat 100 int array in desc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: intParser,
      serializer: (n: number) => n.toString(10),
      maxHeap: 10,
      tempDir
    }).desc();

    expect(file2array(outputPath, intParser)).toEqual(fsort(flat100int).desc());
  });

  it('Should sort flat 100 string array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      tempDir
    }).asc();

    expect(file2array(outputPath, stringParser)).toEqual(
      fsort(flat100string).asc()
    );
  });

  it('Should sort flat 100 string array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      tempDir
    }).desc();

    expect(file2array(outputPath, stringParser)).toEqual(
      fsort(flat100string).desc()
    );
  });

  it('Should sort flat 100 string array in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      maxHeap: 10,
      tempDir
    }).asc();

    expect(file2array(outputPath, stringParser)).toEqual(
      fsort(flat100string).asc()
    );
  });

  it('Should sort flat 100 string array in desc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      maxHeap: 10,
      tempDir
    }).desc();

    expect(file2array(outputPath, stringParser)).toEqual(
      fsort(flat100string).desc()
    );
  });

  it('Should sort 100 object array by property in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      tempDir
    }).asc((v: ITestObject) => (v ? v.index : null));

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).asc((v) => (v ? v.index : null))
    );
  });

  it('Should sort 100 object array by property in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      tempDir
    }).desc((v: ITestObject) => (v ? v.index : null));

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).desc((v) => (v ? v.index : null))
    );
  });

  it('Should sort 100 object array by property in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      maxHeap: 10,
      tempDir
    }).asc((v: ITestObject) => (v ? v.index : null));

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).asc((v) => (v ? v.index : null))
    );
  });

  it('Should sort 100 object array by property in desc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      maxHeap: 10,
      tempDir
    }).desc((v: ITestObject) => (v ? v.index : null));

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).desc((v) => (v ? v.index : null))
    );
  });

  it('Should sort 100 object array by multi properties in asc order', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      tempDir
    }).asc([
      (v) => (v ? v.index : null),
      (v) => (v ? v.name.first : null),
      (v) => (v ? v.guid : null)
    ]);

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).asc([
        (v) => (v ? v.index : null),
        (v) => (v ? v.name.first : null),
        (v) => (v ? v.guid : null)
      ])
    );
  });

  it('Should sort 100 object array by multi properties in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      maxHeap: 10,
      tempDir
    }).asc([
      (v) => (v ? v.index : null),
      (v) => (v ? v.name.first : null),
      (v) => (v ? v.guid : null)
    ]);

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).asc([
        (v) => (v ? v.index : null),
        (v) => (v ? v.name.first : null),
        (v) => (v ? v.guid : null)
      ])
    );
  });

  it('Should sort 100 object array by multi properties in desc order', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      tempDir
    }).desc([
      (v) => (v ? v.index : null),
      (v) => (v ? v.name.first : null),
      (v) => (v ? v.guid : null)
    ]);

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).desc([
        (v) => (v ? v.index : null),
        (v) => (v ? v.name.first : null),
        (v) => (v ? v.guid : null)
      ])
    );
  });

  it('Should sort 100 object array by multi properties in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: objectParser,
      serializer: JSON.stringify,
      maxHeap: 10,
      tempDir
    }).desc([
      (v) => (v ? v.index : null),
      (v) => (v ? v.name.first : null),
      (v) => (v ? v.guid : null)
    ]);

    fs.writeFileSync(
      path.resolve(tempDir, 'out2'),
      fsort(flat100object)
        .desc([
          (v) => (v ? v.index : null),
          (v) => (v ? v.name.first : null),
          (v) => (v ? v.guid : null)
        ])
        .map((v) => JSON.stringify(v) + '\n')
        .join('')
    );

    expect(file2array(outputPath, objectParser)).toEqual(
      fsort(flat100object).desc([
        (v) => (v ? v.index : null),
        (v) => (v ? v.name.first : null),
        (v) => (v ? v.guid : null)
      ])
    );
  });
});
