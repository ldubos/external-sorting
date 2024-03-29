import fsort, { ISortBy } from 'fast-sort';
import fs, { promises as fsp } from 'fs';
import os from 'os';
import path from 'path';
import { Readable, Writable } from 'stream';

async function initialRun<I extends Readable, T>(
  sorter: typeof fsort,
  input: I,
  tempDir: string,
  deserializer: IDeserializer<T>,
  serializer: ISerializer<T>,
  delimiter: string,
  lastDelimiter: boolean,
  maxHeap: number,
  order: Order,
  sortBy: ISortBy<T> | ISortBy<T>[],
  encoding: BufferEncoding
): Promise<string[]> {
  const files: string[] = [];
  let fileIndex = 0;
  let sBuffer = '';
  let tBuffer: T[] = [];

  const writeTBuffer = (): void => {
    tBuffer = sorter(tBuffer)[order](sortBy);
    const fpath = path.resolve(tempDir, `es_${fileIndex}.tmp`);

    let mergedBuffer = '';
    let v: T;

    while ((v = tBuffer.shift()) !== undefined) {
      mergedBuffer += `${serializer(v)}${delimiter}`;
    }

    fs.writeFileSync(fpath, mergedBuffer, encoding);

    files.push(fpath);
    fileIndex++;
  };

  const pushTBuffer = (v: T): void => {
    tBuffer.push(v);

    if (tBuffer.length === maxHeap) writeTBuffer();
  };

  input.on('data', (chunk: Buffer | string) => {
    sBuffer += chunk instanceof Buffer ? chunk.toString(encoding) : chunk;

    let dIndex = sBuffer.indexOf(delimiter);

    if (dIndex === sBuffer.length - 1) {
      pushTBuffer(deserializer(sBuffer.slice(0, dIndex)));
      sBuffer = '';
      return;
    }

    do {
      pushTBuffer(deserializer(sBuffer.slice(0, dIndex)));
      sBuffer = sBuffer.slice(dIndex + 1);
      dIndex = sBuffer.indexOf(delimiter);
    } while (dIndex < sBuffer.length - 1 && dIndex !== -1);
  });

  return await new Promise((resolve, reject) => {
    input.on('end', () => {
      if (sBuffer.length > 0) {
        if (!lastDelimiter) {
          pushTBuffer(deserializer(sBuffer));
        } else {
          const dIndex = sBuffer.indexOf(delimiter);

          if (dIndex !== -1) {
            pushTBuffer(deserializer(sBuffer.slice(0, dIndex)));
          }
        }
      }

      if (tBuffer.length > 0) writeTBuffer();

      resolve(files);
    });

    input.on('error', reject);
  });
}

const EOF = Symbol('EOF');

class FileParser<T> {
  private buffer = '';
  private bbuffer = Buffer.from('');
  private bytesRead = 0;
  private file: string;
  private delimiter: string;
  private delimiterBytes: number;
  private deserialzer: IDeserializer<T>;
  private encoding: BufferEncoding;

  constructor(
    file: string,
    delimiter: string,
    deserialzer: IDeserializer<T>,
    encoding: BufferEncoding
  ) {
    this.file = file;
    this.delimiter = delimiter;
    this.delimiterBytes = Buffer.from(this.delimiter).length;
    this.deserialzer = deserialzer;
    this.encoding = encoding;
  }

  private checkBuffer(): string {
    const dIndex = this.buffer.indexOf(this.delimiter);

    if (dIndex === this.buffer.length - 1) {
      const temp = this.buffer.slice(0, dIndex);
      this.buffer = '';
      return temp;
    }

    const temp = this.buffer.slice(0, dIndex);
    this.buffer = this.buffer.slice(dIndex + 1);

    return temp;
  }

  async gnc(): Promise<T | typeof EOF> {
    if (this.buffer.length > 0 && this.buffer.indexOf(this.delimiter) !== -1) {
      return this.deserialzer(this.checkBuffer());
    }

    const fh = await fsp.open(this.file, 'r');
    const cBuffer = Buffer.alloc(512);
    let readed: {
      bytesRead: number;
      buffer: Buffer;
    };

    while (
      (readed = await fh.read(cBuffer, 0, 512, this.bytesRead)).bytesRead > 0
    ) {
      this.bbuffer = Buffer.concat([this.bbuffer, cBuffer]);
      this.bytesRead += readed.bytesRead;

      const dIndex = this.bbuffer.indexOf(this.delimiter);

      if (dIndex === -1) continue;

      this.buffer = this.bbuffer.slice(0, dIndex + 1).toString(this.encoding);
      this.bbuffer = this.bbuffer.slice(dIndex + 1);

      await fh.close();
      return this.deserialzer(this.checkBuffer());
    }

    if (this.bbuffer.length > 0 && this.bbuffer.indexOf(this.delimiter) > -1) {
      this.buffer = this.bbuffer.toString(this.encoding);
      this.bbuffer = Buffer.from('')

      await fh.close();
      return this.deserialzer(this.checkBuffer());
    }

    await fh.close();

    return EOF;
  }
}

interface IMinHeapNode<T> {
  item: T | typeof EOF;
  file: FileParser<T>;
}

function swap<T>(harr: IMinHeapNode<T>[], a: number, b: number): void {
  const temp = harr[a];
  harr[a] = harr[b];
  harr[b] = temp;
}

interface IComparer<T> {
  (a: T | typeof EOF, b: T | typeof EOF): number;
}

export interface ISortComparer {
  (a: any, b: any, order: number): number;
}

function defaultComparer<T>(a: T, b: T, order: number): number {
  if (a == null) return order;
  if (b == null) return -order;

  if (a < b) return -1;
  if (a === b) return 0;

  return 1;
}

function getComparer<T>(
  comparer: ISortComparer,
  sortBy: ISortBy<T> | ISortBy<T>[],
  order: number
): IComparer<T> {
  if (Array.isArray(sortBy)) {
    const comparers: IComparer<T>[] = [];

    for (let i = 0; i < sortBy.length; i++) {
      comparers.push(getComparer(comparer, sortBy[i], order));
    }

    const cLen = comparers.length;

    return (a: T | typeof EOF, b: T | typeof EOF): number => {
      if (a === EOF) return order * order;
      if (b === EOF) return -order * order;

      let v: number;

      for (let i = 0; i < cLen && (v = comparers[i](a, b)) === 0; i++);

      return v;
    };
  }

  if (typeof sortBy === 'function') {
    return (a: T | typeof EOF, b: T | typeof EOF): number => {
      if (a === EOF) return order * order;
      if (b === EOF) return -order * order;

      return comparer(sortBy(a), sortBy(b), order) * order;
    };
  }

  if (typeof sortBy === 'string') {
    return (a: T | typeof EOF, b: T | typeof EOF): number => {
      if (a === EOF) return order * order;
      if (b === EOF) return -order * order;

      return comparer(a[sortBy], b[sortBy], order) * order;
    };
  }

  return (a: T | typeof EOF, b: T | typeof EOF): number => {
    if (a === EOF) return order * order;
    if (b === EOF) return -order * order;

    return comparer(a, b, order) * order;
  };
}

function heapify<T>(
  harr: IMinHeapNode<T>[],
  i: number,
  heapSize: number,
  comparer: IComparer<T>
): void {
  const t = i << 1;
  const l = t + 1;
  const r = t + 2;
  let first = i;

  if (l < heapSize && comparer(harr[l].item, harr[first].item) < 0) {
    first = l;
  }

  if (r < heapSize && comparer(harr[r].item, harr[first].item) < 0) {
    first = r;
  }

  if (first !== i) {
    swap(harr, i, first);
    heapify(harr, first, heapSize, comparer);
  }
}

function constructHeap<T>(
  harr: IMinHeapNode<T>[],
  comparer: IComparer<T>
): void {
  const heapSize = harr.length;
  let i = (heapSize - 1) >> 1;

  while (i >= 0) heapify(harr, i--, heapSize, comparer);
}

async function mergeSortedFiles<O extends NodeJS.WritableStream, T>(
  sortComparer: ISortComparer,
  filesPath: string[],
  output: O,
  deserializer: IDeserializer<T>,
  serializer: ISerializer<T>,
  delimiter: string,
  order: Order,
  sortBy: ISortBy<T> | ISortBy<T>[],
  encoding: BufferEncoding
): Promise<void> {
  const flen = filesPath.length;

  if (flen === 1) {
    await new Promise<void>((resolve, reject) => {
      const rs = fs.createReadStream(filesPath[0], encoding);

      rs.on('open', () => {
        rs.pipe(output);
      });

      rs.on('error', (err) => {
        output.end();
        reject(err);
      });

      rs.on('end', () => {
        resolve();
      });
    });

    return;
  }

  const harr: IMinHeapNode<T>[] = [];
  const files: FileParser<T>[] = filesPath.map(
    (file) => new FileParser(file, delimiter, deserializer, encoding)
  );

  for (let i = 0; i < flen; i++) {
    harr.push({ item: await files[i].gnc(), file: files[i] });
  }

  const comparer = getComparer(sortComparer, sortBy, order === 'asc' ? 1 : -1);

  constructHeap(harr, comparer);

  while (true) {
    const first = harr[0];

    if (!first || first.item === EOF) break;

    await new Promise((resolve) =>
      output.write(`${serializer(first.item as any)}${delimiter}`, resolve)
    );

    harr[0] = {
      item: await first.file.gnc(),
      file: first.file
    };

    heapify(harr, 0, harr.length, comparer);
  }

  await new Promise<void>((resolve) => output.end(resolve));
}

async function externalSort<I extends Readable, O extends Writable, T>(
  opts: ISortOptions<I, O, T>,
  order: Order,
  sortBy: ISortBy<T> | ISortBy<T>[]
): Promise<void> {
  if (typeof opts.tempDir !== 'string') {
    opts.tempDir = path.resolve(
      os.tmpdir(),
      await fsp.mkdtemp('external-sorting')
    );
  }

  const files = await initialRun(
    fsort.createNewInstance({ comparer: opts.comparer }) as any,
    opts.input,
    opts.tempDir,
    opts.deserializer,
    opts.serializer,
    opts.delimiter,
    opts.lastDelimiter,
    opts.maxHeap,
    order,
    sortBy,
    opts.encoding
  );

  await mergeSortedFiles(
    opts.comparer,
    files,
    opts.output,
    opts.deserializer,
    opts.serializer,
    opts.delimiter,
    order,
    sortBy,
    opts.encoding
  );

  await Promise.all(files.map((file) => fsp.unlink(file)));
}

export interface IDeserializer<T> {
  (str: string): T;
}

export interface ISerializer<T> {
  (val: T): string;
}

export type Order = keyof ISortInstance<unknown>;

export interface ISortInstance<T> {
  asc(sortBy?: ISortBy<T> | ISortBy<T>[]): Promise<void>;
  desc(sortBy?: ISortBy<T> | ISortBy<T>[]): Promise<void>;
}

export interface ISortOptions<I extends Readable, O extends Writable, T> {
  /** input stream */
  input: I;
  /** output stream */
  output: O;
  /** the directory where temporary files will be created */
  tempDir?: string;
  deserializer?: IDeserializer<T>;
  serializer?: ISerializer<T>;
  /** @default '\n' */
  delimiter?: string;
  /**
   * if `true` parse text after the last `delimiter`
   * @default true
   * @example
   * a,b,c,d,e
   *         ^
   *         parsed if true
   */
  lastDelimiter?: boolean;
  /**
   * max instance of the parsed entity in memory
   * @default 100
   */
  maxHeap?: number;
  comparer?: ISortComparer;
  encoding?: BufferEncoding;
}

/**
 * Create new instance of external-sorting.
 * @example
 * import fs from 'fs';
 * import esort from 'external-sorting';
 *
 * esort({
 *   input: fs.createReadStream('input_file'),
 *   output: fs.createWriteStream('output_file'),
 *   tempDir: __dirname,
 *   maxHeap: 1000
 * })
 *   .asc()
 *   .then(() => {
 *     console.log('done');
 *   })
 *   .catch(console.error);
 * @example
 * import fs from 'fs';
 * import esort from 'external-sorting';
 *
 * esort({
 *   input: fs.createReadStream('input_file'),
 *   output: fs.createWriteStream('output_file'),
 *   deserializer: parseFloat,
 *   serializer: (v: number) => v.toString(10),
 *   tempDir: __dirname,
 *   maxHeap: 1000
 * })
 *   .asc()
 *   .then(() => {
 *     console.log('done');
 *   })
 *   .catch(console.error);
 * @example
 * import fs from 'fs';
 * import esort from 'external-sorting';
 *
 * esort({
 *   input: fs.createReadStream('input_file'),
 *   output: fs.createWriteStream('output_file'),
 *   deserializer: JSON.parse,
 *   serializer: JSON.stringify,
 *   delimiter: '\r\n',
 *   tempDir: __dirname,
 *   maxHeap: 500
 * })
 *   .asc((obj) => obj.a.b.c)
 *   .then(() => {
 *     console.log('done');
 *   })
 *   .catch(console.error);
 */
function createSortInstance<I extends Readable, O extends Writable, T>(
  opts: ISortOptions<I, O, T>
): ISortInstance<T> {
  if (typeof opts.deserializer !== 'function') {
    opts.deserializer = (s): T => (s as any) as T;
  }

  if (typeof opts.serializer !== 'function') {
    opts.serializer = (v): string => (v as any) as string;
  }

  if (typeof opts.delimiter !== 'string') {
    opts.delimiter = '\n';
  }

  if (typeof opts.lastDelimiter !== 'boolean') {
    opts.lastDelimiter = true;
  }

  if (typeof opts.maxHeap !== 'number') {
    opts.maxHeap = 100;
  }

  if (typeof opts.comparer !== 'function') {
    opts.comparer = defaultComparer as any;
  }

  if (typeof opts.encoding !== 'string') {
    opts.encoding = 'utf8';
  }

  const sortInstance: ISortInstance<T> = {
    asc: (sortBy?: ISortBy<T> | ISortBy<T>[]) =>
      externalSort(opts, 'asc', sortBy),
    desc: (sortBy?: ISortBy<T> | ISortBy<T>[]) =>
      externalSort(opts, 'desc', sortBy)
  };

  return sortInstance;
}

export default createSortInstance;
