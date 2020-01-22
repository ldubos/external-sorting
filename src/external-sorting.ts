import fsort, { ISortBy } from 'fast-sort';
import fs, { promises as fsp } from 'fs';
import path from 'path';
import { Readable, Writable } from 'stream';

function initialRun<I extends Readable, T>(
  input: I,
  tempDir: string,
  deserializer: IDeserializer<T>,
  serializer: ISerializer<T>,
  delimiter: string,
  maxHeap: number,
  order: Order,
  sortBy: ISortBy<T>
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const files: string[] = [];
    let fileIndex = 0;
    let sBuffer = '';
    let tBuffer: T[] = [];
    let cWS: fs.WriteStream = null;

    const writeTBuffer = (): void => {
      tBuffer = fsort(tBuffer)[order](sortBy);

      cWS = fs.createWriteStream(path.resolve(tempDir, `${fileIndex}.tmp`));

      let v: T;

      while ((v = tBuffer.shift()) !== undefined) {
        cWS.write(`${serializer(v)}${delimiter}`);
      }

      cWS.close();
      files.push(cWS.path.toString());
      fileIndex++;
    };

    const pushTBuffer = (v: T): void => {
      tBuffer.push(v);

      if (tBuffer.length === maxHeap) writeTBuffer();
    };

    input.on('data', (chunk: Buffer | string) => {
      if (typeof chunk !== 'string') chunk = chunk.toString();

      sBuffer += chunk;
      chunk = null;

      let dIndex = sBuffer.indexOf(delimiter);

      if (dIndex === -1) return;

      if (dIndex === sBuffer.length - 1) {
        pushTBuffer(deserializer(sBuffer));
        sBuffer = '';
        return;
      }

      do {
        pushTBuffer(deserializer(sBuffer.substring(0, dIndex)));
        sBuffer = sBuffer.substring(dIndex + 1);
        dIndex = sBuffer.indexOf(delimiter);
      } while (dIndex < sBuffer.length - 1 && dIndex !== -1);
    });

    input.on('end', () => {
      if (sBuffer.length > 0 && sBuffer !== delimiter) {
        pushTBuffer(deserializer(sBuffer));
      }

      if (tBuffer.length > 0) writeTBuffer();

      resolve(files);
    });

    input.on('error', reject);
  });
}

class FileParser {
  private buffer = '';
  private bytesRead = 0;
  private file: string;
  private delimiter: string;

  constructor(file: string, delimiter: string) {
    this.file = file;
    this.delimiter = delimiter;
  }

  private checkBuffer(): string {
    const dIndex = this.buffer.indexOf(this.delimiter);

    if (dIndex === this.buffer.length - 1) {
      const temp = this.buffer;
      this.buffer = '';
      return temp;
    }

    const temp = this.buffer.substring(0, dIndex);
    this.buffer = this.buffer.substring(dIndex + 1);

    return temp;
  }

  async gnc(): Promise<string> {
    if (this.buffer.length > 0 && this.buffer.indexOf(this.delimiter) !== -1) {
      return this.checkBuffer();
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
      this.buffer += cBuffer.toString();
      this.bytesRead += readed.bytesRead;

      const dIndex = this.buffer.indexOf(this.delimiter);

      if (dIndex === -1) continue;

      fh.close();
      return this.checkBuffer();
    }

    fh.close();

    return null;
  }
}

interface IMinHeapNode<T> {
  item: T | null;
  file: FileParser;
}

function swap<T>(harr: IMinHeapNode<T>[], a: number, b: number): void {
  const temp = harr[a];
  harr[a] = harr[b];
  harr[b] = temp;
}

function comparer<T>(a: T, b: T, order: Order, sortBy?: ISortBy<T>): number {
  const nOrder = order === 'asc' ? -1 : 1;

  if (a == null) return 1;
  if (b == null) return -1;

  let va: any;
  let vb: any;

  if (typeof sortBy === 'function') {
    va = sortBy(a);
    vb = sortBy(b);
  } else {
    va = a;
    vb = b;
  }

  if (va == null) return nOrder;
  if (vb == null) return -nOrder;

  if (va < vb) return -1;
  if (va === vb) return 0;

  return 1;
}

function heapify<T>(
  harr: IMinHeapNode<T>[],
  i: number,
  heapSize: number,
  order: Order,
  sortBy: ISortBy<T>
): void {
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  let first = i;

  if (
    l < heapSize &&
    comparer(harr[l].item, harr[i].item, order, sortBy) === -1
  ) {
    first = l;
  }

  if (
    r < heapSize &&
    comparer(harr[r].item, harr[first].item, order, sortBy) === -1
  ) {
    first = r;
  }

  if (first !== i) {
    swap(harr, i, first);
    heapify(harr, first, heapSize, order, sortBy);
  }
}

function constructHeap<T>(
  harr: IMinHeapNode<T>[],
  order: Order,
  sortBy: ISortBy<T>
): void {
  const heapSize = harr.length;
  let i = ~~((heapSize - 1) / 2);

  while (i >= 0) {
    heapify(harr, i, heapSize, order, sortBy);
    i--;
  }
}

async function mergeSortedFiles<O extends NodeJS.WritableStream, T>(
  filesPath: string[],
  output: O,
  deserializer: IDeserializer<T>,
  serializer: ISerializer<T>,
  delimiter: string,
  order: Order,
  sortBy: ISortBy<T>
): Promise<void> {
  const flen = filesPath.length;

  if (flen === 1) {
    const rs = fs.createReadStream(filesPath[0]);

    await new Promise((resolve, reject) => {
      rs.on('error', reject);

      rs.on('data', (chunk) => {
        output.write(chunk);
      });

      rs.on('end', () => {
        output.end();
        resolve();
      });
    });

    return;
  }

  const harr: IMinHeapNode<T>[] = [];
  const files: FileParser[] = filesPath.map(
    (file) => new FileParser(file, delimiter)
  );

  for (let i = 0; i < flen; i++) {
    const chunk = await files[i].gnc();
    harr.push({ item: deserializer(chunk), file: files[i] });
  }

  constructHeap(harr, order, sortBy);

  while (true) {
    const first = harr[0];

    if (!first || !first.item) break;

    output.write(`${serializer(first.item)}${delimiter}`);

    const chunk = await first.file.gnc();

    harr[0] = {
      item: chunk != null ? deserializer(chunk) : null,
      file: first.file
    };

    heapify(harr, 0, harr.length, order, sortBy);
  }

  output.end();
}

async function externalSort<I extends Readable, O extends Writable, T>(
  input: I,
  output: O,
  tempDir: string,
  deserializer: IDeserializer<T>,
  serializer: ISerializer<T>,
  delimiter: string,
  maxHeap: number,
  order: Order,
  sortBy: ISortBy<T>
): Promise<void> {
  const files = await initialRun(
    input,
    tempDir,
    deserializer,
    serializer,
    delimiter,
    maxHeap,
    order,
    sortBy
  );

  await mergeSortedFiles(
    files,
    output,
    deserializer,
    serializer,
    delimiter,
    order,
    sortBy
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
  asc(sortBy?: ISortBy<T>): Promise<void>;
  desc(sortBy?: ISortBy<T>): Promise<void>;
}

export interface ISortOptions<I extends Readable, O extends Writable, T> {
  input: I;
  output: O;
  tempDir: string;
  deserializer?: IDeserializer<T>;
  serializer?: ISerializer<T>;
  delimiter?: string;
  maxHeap?: number;
}

function createSortInstance<I extends Readable, O extends Writable, T>(
  opts: ISortOptions<I, O, T>
): ISortInstance<T> {
  if (typeof opts.deserializer !== 'function') {
    opts.deserializer = (s): T => (s as any) as T;
  }

  if (typeof opts.serializer !== 'function') {
    opts.serializer = (v): string => (v as any) as string;
  }

  if (typeof opts.delimiter !== 'number') {
    opts.delimiter = '\n';
  }

  if (typeof opts.maxHeap !== 'number') {
    opts.maxHeap = 100;
  }

  const sortInstance: ISortInstance<T> = {
    asc: (sortBy?: ISortBy<T>) =>
      externalSort(
        opts.input,
        opts.output,
        opts.tempDir,
        opts.deserializer,
        opts.serializer,
        opts.delimiter,
        opts.maxHeap,
        'asc',
        sortBy
      ),
    desc: (sortBy?: ISortBy<T>) =>
      externalSort(
        opts.input,
        opts.output,
        opts.tempDir,
        opts.deserializer,
        opts.serializer,
        opts.delimiter,
        opts.maxHeap,
        'desc',
        sortBy
      )
  };

  return sortInstance;
}

export default createSortInstance;
