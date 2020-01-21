[![Contributors][contributors-shield]][contributors-url] [![Forks][forks-shield]][forks-url] [![Stargazers][stars-shield]][stars-url] [![Issues][issues-shield]][issues-url] [![MIT License][license-shield]][license-url]

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

## TODO

- [ ] add unit tests
- [ ] add benchmark
- [ ] support `.by` of fast-sort
- [ ] add ability to sort by multi properties
- [ ] add a better docs

## Credits

Thanks to [@snovakovic](https://github.com/snovakovic) for the fast-sort package, you can find it on [NPM](https://www.npmjs.com/package/fast-sort) or [GitHub](https://github.com/snovakovic/fast-sort)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[contributors-shield]: https://img.shields.io/github/contributors/ldubos/external-sorting.svg?style=flat-square
[contributors-url]: https://github.com/ldubos/external-sorting/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ldubos/external-sorting.svg?style=flat-square
[forks-url]: https://github.com/ldubos/external-sorting/network/members
[stars-shield]: https://img.shields.io/github/stars/ldubos/external-sorting.svg?style=flat-square
[stars-url]: https://github.com/ldubos/external-sorting/stargazers
[issues-shield]: https://img.shields.io/github/issues/ldubos/external-sorting.svg?style=flat-square
[issues-url]: https://github.com/ldubos/external-sorting/issues
[license-shield]: https://img.shields.io/github/license/ldubos/external-sorting.svg?style=flat-square
[license-url]: https://github.com/ldubos/external-sorting/blob/master/LICENSE
