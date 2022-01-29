"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_sort_1 = __importDefault(require("fast-sort"));
const fs_1 = __importStar(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
async function initialRun(sorter, input, tempDir, deserializer, serializer, delimiter, lastDelimiter, maxHeap, order, sortBy, encoding) {
    const files = [];
    let fileIndex = 0;
    let sBuffer = '';
    let tBuffer = [];
    const writeTBuffer = () => {
        tBuffer = sorter(tBuffer)[order](sortBy);
        const fpath = path_1.default.resolve(tempDir, `es_${fileIndex}.tmp`);
        let mergedBuffer = '';
        let v;
        while ((v = tBuffer.shift()) !== undefined) {
            mergedBuffer += `${serializer(v)}${delimiter}`;
        }
        fs_1.default.writeFileSync(fpath, mergedBuffer, encoding);
        files.push(fpath);
        fileIndex++;
    };
    const pushTBuffer = (v) => {
        tBuffer.push(v);
        if (tBuffer.length === maxHeap)
            writeTBuffer();
    };
    input.on('data', (chunk) => {
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
    constructor(file, delimiter, deserialzer, encoding) {
        this.buffer = '';
        this.bbuffer = Buffer.from('');
        this.bytesRead = 0;
        this.file = file;
        this.delimiter = delimiter;
        this.delimiterBytes = Buffer.from(this.delimiter).length;
        this.deserialzer = deserialzer;
        this.encoding = encoding;
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
            this.bbuffer = Buffer.concat([this.bbuffer, cBuffer]);
            this.bytesRead += readed.bytesRead;
            const dIndex = this.bbuffer.indexOf(this.delimiter);
            if (dIndex === -1)
                continue;
            this.buffer = this.bbuffer.slice(0, dIndex + 1).toString(this.encoding);
            this.bbuffer = this.bbuffer.slice(dIndex + 1);
            await fh.close();
            return this.deserialzer(this.checkBuffer());
        }
        if (this.bbuffer.length > 0 && this.bbuffer.indexOf(this.delimiter) > -1) {
            this.buffer = this.bbuffer.toString(this.encoding);
            this.bbuffer = Buffer.from('');
            await fh.close();
            return this.deserialzer(this.checkBuffer());
        }
        await fh.close();
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
function getComparer(comparer, sortBy, order) {
    if (Array.isArray(sortBy)) {
        const comparers = [];
        for (let i = 0; i < sortBy.length; i++) {
            comparers.push(getComparer(comparer, sortBy[i], order));
        }
        const cLen = comparers.length;
        return (a, b) => {
            if (a === EOF)
                return order * order;
            if (b === EOF)
                return -order * order;
            let v;
            for (let i = 0; i < cLen && (v = comparers[i](a, b)) === 0; i++)
                ;
            return v;
        };
    }
    if (typeof sortBy === 'function') {
        return (a, b) => {
            if (a === EOF)
                return order * order;
            if (b === EOF)
                return -order * order;
            return comparer(sortBy(a), sortBy(b), order) * order;
        };
    }
    if (typeof sortBy === 'string') {
        return (a, b) => {
            if (a === EOF)
                return order * order;
            if (b === EOF)
                return -order * order;
            return comparer(a[sortBy], b[sortBy], order) * order;
        };
    }
    return (a, b) => {
        if (a === EOF)
            return order * order;
        if (b === EOF)
            return -order * order;
        return comparer(a, b, order) * order;
    };
}
function heapify(harr, i, heapSize, comparer) {
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
function constructHeap(harr, comparer) {
    const heapSize = harr.length;
    let i = (heapSize - 1) >> 1;
    while (i >= 0)
        heapify(harr, i--, heapSize, comparer);
}
async function mergeSortedFiles(sortComparer, filesPath, output, deserializer, serializer, delimiter, order, sortBy, encoding) {
    const flen = filesPath.length;
    if (flen === 1) {
        await new Promise((resolve, reject) => {
            const rs = fs_1.default.createReadStream(filesPath[0], encoding);
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
    const files = filesPath.map((file) => new FileParser(file, delimiter, deserializer, encoding));
    for (let i = 0; i < flen; i++) {
        harr.push({ item: await files[i].gnc(), file: files[i] });
    }
    const comparer = getComparer(sortComparer, sortBy, order === 'asc' ? 1 : -1);
    constructHeap(harr, comparer);
    while (true) {
        const first = harr[0];
        if (!first || first.item === EOF)
            break;
        await new Promise((resolve) => output.write(`${serializer(first.item)}${delimiter}`, resolve));
        harr[0] = {
            item: await first.file.gnc(),
            file: first.file
        };
        heapify(harr, 0, harr.length, comparer);
    }
    await new Promise((resolve) => output.end(resolve));
}
async function externalSort(opts, order, sortBy) {
    if (typeof opts.tempDir !== 'string') {
        opts.tempDir = path_1.default.resolve(os_1.default.tmpdir(), await fs_1.promises.mkdtemp('external-sorting'));
    }
    const files = await initialRun(fast_sort_1.default.createNewInstance({ comparer: opts.comparer }), opts.input, opts.tempDir, opts.deserializer, opts.serializer, opts.delimiter, opts.lastDelimiter, opts.maxHeap, order, sortBy, opts.encoding);
    await mergeSortedFiles(opts.comparer, files, opts.output, opts.deserializer, opts.serializer, opts.delimiter, order, sortBy, opts.encoding);
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
    if (typeof opts.comparer !== 'function') {
        opts.comparer = defaultComparer;
    }
    if (typeof opts.encoding !== 'string') {
        opts.encoding = 'utf8';
    }
    const sortInstance = {
        asc: (sortBy) => externalSort(opts, 'asc', sortBy),
        desc: (sortBy) => externalSort(opts, 'desc', sortBy)
    };
    return sortInstance;
}
exports.default = createSortInstance;
