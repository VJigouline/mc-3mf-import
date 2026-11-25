import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { load3mf, ThreeMfImportError } from '../src/index.js';
import { sample } from './files.js';

describe('3MF', () => {
  it('reads a model in millimetres, turned Y up', async () => {
    const r = await load3mf(sample('cube_gears.3mf'));
    expect(r.unit).toBe('millimeter');
    expect(r.unitScale).toBe(0.001);
    expect(r.stats.meshes).toBeGreaterThan(0);
    expect(r.stats.items).toBeGreaterThan(0);
    expect(r.group.rotation.x).toBeCloseTo(-Math.PI / 2);
    const size = new THREE.Box3().setFromObject(r.group).getSize(new THREE.Vector3());
    // A desk-sized part, in metres.
    expect(Math.max(size.x, size.y, size.z)).toBeLessThan(1);
  });

  // Colour groups are found by a selector that, in XML, browsers match by local name (m:colorgroup)
  // but Node's DOM implementations do not; colours are checked in a browser instead.
  // The other samples (colours, lattices, volumetric data) use namespaced 3MF extensions that
  // three.js finds with selectors browsers match by local name but Node's DOMs do not. They are
  // checked in a browser instead.

  it('refuses files that are not 3MF', async () => {
    await expect(load3mf({ name: 'a.3mf', data: 'hello' })).rejects.toThrow(ThreeMfImportError);
  });
});
