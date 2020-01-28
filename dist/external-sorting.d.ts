/// <reference types="node" />
import { ISortBy } from 'fast-sort';
import { Readable, Writable } from 'stream';
export interface IDeserializer<T> {
    (str: string): T;
}
export interface ISerializer<T> {
    (val: T): string;
}
export declare type Order = keyof ISortInstance<unknown>;
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
declare function createSortInstance<I extends Readable, O extends Writable, T>(opts: ISortOptions<I, O, T>): ISortInstance<T>;
export default createSortInstance;
