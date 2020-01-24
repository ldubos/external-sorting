[![Stargazers][stars-shield]][stars-url] [![Downloads][downloads-shield]][downloads-url] [![Issues][issues-shield]][issues-url] [![Vulnerabilities][vulnerabilities-shield]][vulnerabilities-url] [![MIT License][license-shield]][license-url]

<br/>
<div align="center">
  <h1 style="text-align: center; margin-top: 15px; border:none;">External Sorting</h1>
</div>

For my work I needed an external sorting algorithm to sort big arrays (for example: sort 32 array of ~300MB with 2GB of RAM at the same time), but I haven't found any resource which talks about this kind of solution for NodeJS, so I've created it, I've decided to share this part of my project with the community and I hope that the community will help me to improve my solution.

## Quick examples

*asc* sort of strings separate with `\n`

```typescript
import fs from 'fs';
import esort from 'external-sorting';

esort({
  input: fs.createReadStream('input_file'),
  output: fs.createWriteStream('output_file'),
  tempDir: __dirname,
  maxHeap: 100
})
  .asc()
  .then(() => {
    console.log('done');
  })
  .catch(console.error);
```

*desc* sort of numbers separate with `\n`

```typescript
import fs from 'fs';
import esort from 'external-sorting';

await esort({
  input: fs.createReadStream('input_file'),
  output: fs.createWriteStream('output_file'),
  tempDir: __dirname,
  deserializer: parseFloat,
  serializer: (v: number) => v.toString(10),
  maxHeap: 100
})
  .desc()
  .then(() => {
    console.log('done');
  })
  .catch(console.error);
```

*asc* sort of objects by property `a.b.c` separate with `\r\n`

```typescript
import fs from 'fs';
import esort from 'external-sorting';

await esort({
  input: fs.createReadStream('input_file'),
  output: fs.createWriteStream('output_file'),
  tempDir: __dirname,
  deserializer: JSON.parse,
  serializer: JSON.stringify,
  delimiter: '\r\n',
  maxHeap: 100
})
  .asc((obj) => obj.a.b.c)
  .then(() => {
    console.log('done');
  })
  .catch(console.error);
```

## Benchmark

| | Mean [s] | Min [s] | Max [s] | Relative |
|:---|---:|---:|---:|---:|
| sort 500,000 `string` | 2.637 ± 0.048 | 2.570 | 2.714 | 1.00 |
| sort 500,000 `number` | 3.691 ± 0.259 | 3.442 | 4.234 | 1.40 ± 0.10 |
| sort 500,000 `object` | 5.039 ± 0.262 | 4.741 | 5.407 | 1.91 ± 0.11 |
| sort 1,000,000 `string` | 5.887 ± 0.637 | 5.105 | 6.820 | 2.23 ± 0.24 |
| sort 1,000,000 `number` | 6.978 ± 0.499 | 6.531 | 7.966 | 2.65 ± 0.20 |
| sort 1,000,000 `object` | 9.665 ± 0.111 | 9.522 | 9.791 | 3.66 ± 0.08 |

```
Model Name: MacBook Pro
Model ID: MacBookPro14.3
Processor Name: Quad-Core Intel Core i7
Processor speed: 2.8 GHz
Number of processors: 1
Total number of cores: 4
Level 2 cache (per core): 256 KB
Level 3 cache: 6 MB
Hyper-Threading Technology: Enabled
Memory: 16 GB
SSD: Apple SM0512L
```

## TODO

- [ ] support `.by` of fast-sort
- [ ] add ability to sort by multi properties
- [ ] add a better docs

## Credits

Thanks to [@snovakovic](https://github.com/snovakovic) for the fast-sort package, you can find it on [NPM](https://www.npmjs.com/package/fast-sort) or [GitHub](https://github.com/snovakovic/fast-sort)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[downloads-shield]: https://img.shields.io/npm/dt/external-sorting.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/external-sorting
[vulnerabilities-shield]: https://snyk.io/test/github/ldubos/external-sorting/badge.svg?targetFile=package.json&style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/ldubos/external-sorting?targetFile=package.json
[stars-shield]: https://img.shields.io/github/stars/ldubos/external-sorting.svg?style=flat-square
[stars-url]: https://github.com/ldubos/external-sorting/stargazers
[issues-shield]: https://img.shields.io/github/issues/ldubos/external-sorting.svg?style=flat-square
[issues-url]: https://github.com/ldubos/external-sorting/issues
[license-shield]: https://img.shields.io/github/license/ldubos/external-sorting.svg?style=flat-square
[license-url]: https://github.com/ldubos/external-sorting/blob/master/LICENSE
