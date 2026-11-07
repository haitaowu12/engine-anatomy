import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync, renameSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {addStudyFallback} from './study-fallback.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const builder = resolve(process.argv[2] ?? join(root, '../tonys-second-brain/scripts/machine_explainers.mjs'));
const directory = join(root, 'design/realistic-engine');
const kinds = ['turboshaft', 'turboprop', 'turbofan'];
const output = mkdtempSync(join(tmpdir(), 'engine-anatomy-studies-'));

try {
  for (const kind of kinds) {
    const result = spawnSync(process.execPath, [builder, '--source', join(directory, 'model', kind+'.mjs'),
      '--output', join(output, kind+'-study.html')], {stdio:'inherit'});
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error('Unable to build the '+kind+' study.');
    const built=join(output,kind+'-study.html');
    writeFileSync(built,addStudyFallback(readFileSync(built,'utf8'),kind));
  }
  for (const kind of kinds) {
    const page = kind+'-study.html';
    renameSync(join(output,page), join(directory,page));
  }
} finally {
  rmSync(output,{recursive:true,force:true});
}
