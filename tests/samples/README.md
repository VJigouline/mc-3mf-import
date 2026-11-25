# 3MF test files

Real 3MF files that the tests load. They are unchanged copies, taken at commit `1d3772857e` of three.js.

| Files | What they cover | Source and licence |
| --- | --- | --- |
| `cube_gears.3mf`, `facecolors.3mf`, `vertexcolors.3mf`, `pyramid.3mf`, `variable voronoi.3mf` | Meshes, face and vertex colours, a beam lattice | The [3MF Consortium's samples](https://github.com/3MFConsortium/3mf-samples), [BSD 2-Clause](https://opensource.org/license/bsd-2-clause), as copied into the three.js repository. |
| `volumetric.3mf` | Volumetric data | The 3MF Consortium's [gladius](https://github.com/3MFConsortium/gladius) (`SphereInACage.3mf`), BSD 2-Clause. |

In Node, only `cube_gears.3mf` is drawn by the tests: the other files use namespaced extensions that three.js finds with selectors browsers match by local name, but Node's DOM implementations do not. They are checked in a browser.

These files keep their own licences. They are test data only, and are not part of the npm package, which includes only `dist`, `Documentation`, `README.md` and `LICENSE`.
