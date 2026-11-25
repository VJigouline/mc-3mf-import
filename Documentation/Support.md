# Formats and support

mc-3mf-import reads 3MF with three.js's 3MFLoader.

## What is read

- Meshes of objects and components, placed by the build items.
- Base materials, colour groups (vertex and face colours), and textures from the package.
- The model's unit (micron to metre; millimetres by default), scaled to metres, and its metadata, such as Title and Designer.

## Orientation and units

3MF models are Z up; the group turns them Y up and scales them to metres by the model's unit.

## Limits

The beam lattice, volumetric and slice extensions are not drawn. three.js reads the package's XML with DOMParser, so in Node a DOM implementation must be provided; the tests use jsdom.
