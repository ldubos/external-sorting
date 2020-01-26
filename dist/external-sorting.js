"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_sort_1 = __importDefault(require("fast-sort"));
const fs_1 = __importStar(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
function initialRun(input, tempDir, deserializer, serializer, delimiter, lastDelimiter, maxHeap, order, sortBy) {
    return new Promise((resolve, reject) => {
        const files = [];
        let fileIndex = 0;
        let sBuffer = '';
        let tBuffer = [];
        let cWS = null;
        const writeTBuffer = () => {
            tBuffer = fast_sort_1.default(tBuffer)[order](sortBy);
            cWS = fs_1.default.createWriteStream(path_1.default.resolve(tempDir, `${fileIndex}.tmp`));
            let v;
            while ((v = tBuffer.shift()) !== undefined) {
                cWS.write(`${serializer(v)}${delimiter}`);
            }
            cWS.close();
            files.push(cWS.path.toString());
            fileIndex++;
        };
        const pushTBuffer = (v) => {
            tBuffer.push(v);
            if (tBuffer.length === maxHeap)
                writeTBuffer();
        };
        input.on('data', (chunk) => {
            if (typeof chunk !== 'string')
                chunk = chunk.toString();
            sBuffer += chunk;
            chunk = null;
            let dIndex = sBuffer.indexOf(delimiter);
            if (dIndex === -1)
                return;
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
        input.on('end', () => {
            if (sBuffer.length > 0) {
                if (!lastDelimiter) {
                    pushTBuffer(deserializer(sBuffer));
                }
                else {
                    const dIndex = sBuffer.indexOf(delimiter);
                    if (dIndex !== -1) {
                        pushTBuffer(deserializer(sBuffer.slice(0, dIndex)));
                    }
                }
            }
            if (tBuffer.length > 0)
                writeTBuffer();
            resolve(files);
        });
        input.on('error', reject);
    });
}
const EOF = Symbol('EOF');
class FileParser {
    constructor(file, delimiter, deserialzer) {
        this.buffer = '';
        this.bytesRead = 0;
        this.file = file;
        this.delimiter = delimiter;
        this.deserialzer = deserialzer;
    }
    checkBuffer() {
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
    async gnc() {
        if (this.buffer.length > 0 && this.buffer.indexOf(this.delimiter) !== -1) {
            return this.deserialzer(this.checkBuffer());
        }
        const fh = await fs_1.promises.open(this.file, 'r');
        const cBuffer = Buffer.alloc(512);
        let readed;
        while ((readed = await fh.read(cBuffer, 0, 512, this.bytesRead)).bytesRead > 0) {
            this.buffer += cBuffer.toString();
            this.bytesRead += readed.bytesRead;
            const dIndex = this.buffer.indexOf(this.delimiter);
            if (dIndex === -1)
                continue;
            fh.close();
            return this.deserialzer(this.checkBuffer());
        }
        fh.close();
        return EOF;
    }
}
function swap(harr, a, b) {
    const temp = harr[a];
    harr[a] = harr[b];
    harr[b] = temp;
}
function defaultComparer(a, b, order) {
    if (a == null)
        return order;
    if (b == null)
        return -order;
    if (a < b)
        return -1;
    if (a === b)
        return 0;
    return 1;
}
function getComparer(sortBy, order) {
    if (typeof sortBy === 'function') {
        return (a, b) => {
            if (a === EOF)
                return order * order;
            if (b === EOF)
                return -order * order;
            return defaultComparer(sortBy(a), sortBy(b), order) * order;
        };
    }
    return (a, b) => {
        if (a === EOF)
            return order * order;
        if (b === EOF)
            return -order * order;
        return defaultComparer(a, b, order) * order;
    };
}
function heapify(harr, i, heapSize, comparer) {
    const t = i << 1;
    const l = t + 1;
    const r = t + 2;
    let first = i;
    if (l < heapSize && comparer(harr[l].item, harr[first].item) === -1) {
        first = l;
    }
    if (r < heapSize && comparer(harr[r].item, harr[first].item) === -1) {
        first = r;
    }
    if (first !== i) {
        swap(harr, i, first);
        heapify(harr, first, heapSize, comparer);
    }
}
function constructHeap(harr, comparer) {
    const heapSize = harr.length;
    let i = (heapSize - 1) >> 1;
    while (i >= 0)
        heapify(harr, i--, heapSize, comparer);
}
async function mergeSortedFiles(filesPath, output, deserializer, serializer, delimiter, order, sortBy) {
    const flen = filesPath.length;
    if (flen === 1) {
        await new Promise((resolve, reject) => {
            const rs = fs_1.default.createReadStream(filesPath[0]);
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
    const harr = [];
    const files = filesPath.map((file) => new FileParser(file, delimiter, deserializer));
    for (let i = 0; i < flen; i++) {
        harr.push({ item: await files[i].gnc(), file: files[i] });
    }
    const comparer = getComparer(sortBy, order === 'asc' ? 1 : -1);
    constructHeap(harr, comparer);
    while (true) {
        const first = harr[0];
        if (!first || first.item === EOF)
            break;
        output.write(`${serializer(first.item)}${delimiter}`);
        harr[0] = {
            item: await first.file.gnc(),
            file: first.file
        };
        heapify(harr, 0, harr.length, comparer);
    }
    output.end();
}
async function externalSort(opts, order, sortBy) {
    if (typeof opts.tempDir !== 'string') {
        opts.tempDir = path_1.default.resolve(os_1.default.tmpdir(), await fs_1.promises.mkdtemp('external-sorting'));
    }
    const files = await initialRun(opts.input, opts.tempDir, opts.deserializer, opts.serializer, opts.delimiter, opts.lastDelimiter, opts.maxHeap, order, sortBy);
    await mergeSortedFiles(files, opts.output, opts.deserializer, opts.serializer, opts.delimiter, order, sortBy);
    await Promise.all(files.map((file) => fs_1.promises.unlink(file)));
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
function createSortInstance(opts) {
    if (typeof opts.deserializer !== 'function') {
        opts.deserializer = (s) => s;
    }
    if (typeof opts.serializer !== 'function') {
        opts.serializer = (v) => v;
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
    const sortInstance = {
        asc: (sortBy) => externalSort(opts, 'asc', sortBy),
        desc: (sortBy) => externalSort(opts, 'desc', sortBy)
    };
    return sortInstance;
}
exports.default = createSortInstance;
