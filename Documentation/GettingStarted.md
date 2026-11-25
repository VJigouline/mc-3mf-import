# Getting started

## Install

```sh
npm install three github:VJigouline/mc-3mf-import
```

## Open a file

`load3mf` takes the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files. Zip archives among them are opened. It returns a promise of the model.

```ts
import * as THREE from 'three';
import { load3mf } from 'mc-3mf-import';

const input = document.querySelector<HTMLInputElement>('input[type=file]')!;
input.addEventListener('change', async () => {
  const result = await load3mf(input.files![0]!);
  scene.add(result.group);
  for (const warning of result.warnings) console.warn(warning);
});
```

## What you get

- **`group`:** a `THREE.Group` holding the model, named after the file.
- **`stats`:** counts of what was read.
- **`warnings`:** anything that couldn't be read or was left out.

3MF models are Z up; the group turns them Y up and scales them to metres by the model's unit.

## Options

- **`main`** (default the first .3mf file): The .3mf file to open, if several are given.
- **`unitScale`** (default from the model): Metres per model unit.

See the [API](API.md) for every field of the result.
