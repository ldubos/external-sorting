/* eslint-disable */
import fs, { promises as fsp } from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import esort from '../src/external-sorting';

describe('sort', () => {
  const tempDir: string = path.resolve(__dirname, '.tmp');
  const outputPath: string = path.resolve(tempDir, 'output');

  const flat10intPath: string = path.resolve(__dirname, 'arrays', '10_int');
  const flat10int = [1551, 5773, 4349, 3118, 2558, 1927, 1193, 3373, 3464, 392];
  const flat100intPath: string = path.resolve(__dirname, 'arrays', '100_int');
  const flat100int = [
    5282,
    3000,
    3833,
    5867,
    9097,
    7864,
    9490,
    7548,
    6143,
    775,
    236,
    6228,
    7135,
    6585,
    413,
    8540,
    193,
    1819,
    6901,
    1713,
    9668,
    4046,
    6675,
    1740,
    8896,
    4076,
    7284,
    6945,
    9198,
    784,
    8185,
    7029,
    6454,
    6774,
    491,
    946,
    2879,
    8053,
    3568,
    4753,
    5361,
    6473,
    3342,
    3343,
    3275,
    2516,
    3657,
    2713,
    404,
    5694,
    6829,
    7441,
    6999,
    3321,
    8134,
    5315,
    5975,
    3814,
    2513,
    1395,
    6819,
    7943,
    456,
    7287,
    3442,
    7051,
    9720,
    6283,
    8194,
    2646,
    4066,
    1084,
    1403,
    6863,
    1868,
    6479,
    9162,
    9224,
    6017,
    6486,
    7031,
    3658,
    7258,
    6267,
    1364,
    5611,
    5103,
    6399,
    1901,
    4876,
    8021,
    5757,
    8016,
    2827,
    587,
    2869,
    7783,
    73,
    5935,
    5295
  ];

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
  })

  it('Should sort flat 10 int array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat10intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat10int.sort((a: number, b: number) => a - b));
  });

  it('Should sort flat 10 int array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat10intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).desc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat10int.sort((a: number, b: number) => b - a));
  });

  it('Should sort flat 100 int array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat100int.sort((a: number, b: number) => a - b));
  });

  it('Should sort flat 100 int array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).desc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat100int.sort((a: number, b: number) => b - a));
  });

  it('Should sort flat 100 int array in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      maxHeap: 10,
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat100int.sort((a: number, b: number) => a - b));
  });
});
