import * as THREE from 'three';
import { unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { countModel, FileManager, ImportFiles, orient, type ImportInput, type ImportStats } from './common.js';

export { ImportFiles, FileManager, countModel } from './common.js';
export type { ImportInput, ImportFile, ImportData, ImportStats } from './common.js';

export interface ThreeMfOptions {
  /** The .3mf file to open, if several are given. By default, the first. */
  main?: string;
  /** Metres per model unit, overriding the unit the file states (millimetres by default). */
  unitScale?: number;
}

export interface ThreeMfLoadResult {
  /** The model, in metres and Y up: a group named after the file. */
  group: THREE.Group;
  /** The unit the model states: micron, millimeter, centimeter, inch, foot or meter. */
  unit: string;
  /** Metres per model unit. */
  unitScale: number;
  /** Metadata from the model, such as Title or Designer. */
  metadata: Record<string, string>;
  warnings: string[];
  stats: ThreeMfStats;
}

export interface ThreeMfStats extends ImportStats {
  /** Build items, each a placed object. */
  items: number;
}

export class ThreeMfImportError extends Error {
  override name = 'ThreeMfImportError';
}

const UNITS: Record<string, number> = { micron: 1e-6, millimeter: 0.001, centimeter: 0.01, inch: 0.0254, foot: 0.3048, meter: 1 };

/** Reads a 3MF file: a zip of XML model parts with their textures. */
export async function load3mf(input: ImportInput, options: ThreeMfOptions = {}): Promise<ThreeMfLoadResult> {
  const files = await ImportFiles.from(input, 'model.3mf', ['3mf']);
  const main = files.main(['3mf'], options.main) ?? files.files[0];
  if (!main) throw new ThreeMfImportError('There is no .3mf file to open');
  const bytes = main.bytes;
  if (!(bytes[0] === 0x50 && bytes[1] === 0x4b)) throw new ThreeMfImportError(`${main.name} is not a 3MF file: it is not a zip package`);

  // The root model part states the unit and metadata.
  let unit = 'millimeter';
  const metadata: Record<string, string> = {};
  let items = 0;
  try {
    const parts = unzipSync(bytes, { filter: (f) => /\.model$/i.test(f.name) });
    const rootName = Object.keys(parts).find((n) => /^3D\/[^/]+\.model$/i.test(n)) ?? Object.keys(parts)[0];
    if (!rootName) throw new ThreeMfImportError(`${main.name} has no 3D model part`);
    const xml = new TextDecoder().decode(parts[rootName]);
    unit = /<model\b[^>]*\bunit\s*=\s*"([^"]+)"/i.exec(xml)?.[1]?.toLowerCase() ?? 'millimeter';
    for (const m of xml.matchAll(/<metadata\b[^>]*\bname\s*=\s*"([^"]+)"[^>]*>([^<]*)<\/metadata>/gi)) metadata[m[1]!] = m[2]!.trim();
    items = [...xml.matchAll(/<item\b/gi)].length;
  } catch (error) {
    if (error instanceof ThreeMfImportError) throw error;
    throw new ThreeMfImportError(`${main.name} is not a readable 3MF package: ${(error as Error).message}`);
  }

  const fm = new FileManager(files);
  const warnings: string[] = [];
  const loader = new ThreeMFLoader(fm.manager);
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  let model: THREE.Group;
  try {
    model = loader.parse(data);
  } catch (error) {
    throw new ThreeMfImportError(`${main.name} could not be read: ${(error as Error).message}`);
  }
  await fm.done();
  fm.dispose();
  const scale = options.unitScale ?? UNITS[unit] ?? 0.001;
  if (!(unit in UNITS)) warnings.push(`Unknown unit ${unit}; millimetres are assumed`);
  const name = main.name.replace(/\\/g, '/').split('/').pop()!.replace(/\.3mf$/i, '');
  model.name = name;
  // 3MF models are Z up, in their unit.
  const group = orient(model, name, true, scale);
  return { group, unit, unitScale: scale, metadata, warnings, stats: { ...countModel(group), items } };
}
