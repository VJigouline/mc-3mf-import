# mc-3mf-import

A 3MF importer for [three.js](https://threejs.org/), written in TypeScript. It reads 3D Manufacturing Format packages, the format of 3D printing, with their objects, components, build items, colours, materials and textures, in metres and Y up. It was made for [SceneEditor](https://github.com/VJigouline/SceneEditor), and works in any three.js application.

```ts
import { load3mf } from 'mc-3mf-import';

const result = await load3mf(await file.arrayBuffer());
scene.add(result.group);
console.log(result.warnings);       // anything that couldn't be read
```

## What it reads

- Meshes of objects and components, placed by the build items.
- Base materials, colour groups (vertex and face colours), and textures from the package.
- The model's unit (micron to metre; millimetres by default), scaled to metres, and its metadata, such as Title and Designer.

The beam lattice, volumetric and slice extensions are not drawn. three.js reads the package's XML with DOMParser, so in Node a DOM implementation must be provided; the tests use jsdom. See [Formats and support](Documentation/Support.md) for the details.

## Install

The package is not on the npm registry. Install it from GitHub:

```sh
npm install github:VJigouline/mc-3mf-import
```

`three` (r160 or later) is a peer dependency. The package builds itself on install.

## Documentation

- [Getting started](Documentation/GettingStarted.md)
- [API](Documentation/API.md)
- [Formats and support](Documentation/Support.md)
- [Using it in SceneEditor](Documentation/SceneEditor.md)

## Development

```sh
npm install
npm test           # unit tests, with Vitest
npm run typecheck
npm run build      # dist/
```

The tests load real 3MF files, kept in [`tests/samples`](tests/samples/README.md) with their licences. It needs Node.js 22 or later.

## Licence

[MIT](LICENSE)
