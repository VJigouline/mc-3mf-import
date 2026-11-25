# API

## `load3mf(input, options?)`

Reads `.3mf` and returns a promise of a `3mfLoadResult`.

`input` is the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files. Zip archives among them are opened.

It throws `ThreeMfImportError` for input that isn't 3MF.

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `main` | the first .3mf file | The .3mf file to open, if several are given. |
| `unitScale` | from the model | Metres per model unit. |

### `3mfLoadResult`

| Field | Type | Meaning |
| --- | --- | --- |
| `group` | `THREE.Group` | The model. |
| `unit` | `string` | The model's unit: micron, millimeter, centimeter, inch, foot or meter. |
| `unitScale` | `number` | Metres per model unit. |
| `metadata` | `Record<string, string>` | The model's metadata. |
| `warnings` | `string[]` | Problems that didn't stop the import. |
| `stats` | object | Counts of meshes, triangles and the like. |

See the package's `index.d.ts` for every exported type and helper.
