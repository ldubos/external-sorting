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
declare function createSortInstance<I extends Readable, O extends Writable, T>(opts: ISortOptions<I, O, T>): ISortInstance<T>;
export default createSortInstance;
