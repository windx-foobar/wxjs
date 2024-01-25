// import { existsSync } from 'node:fs';
// import { writeFile } from 'node:fs/promises';
import { defineBuildConfig } from 'unbuild';
// import { resolve } from 'pathe';
import { fixDeclarationPathWhenStub } from '../../_utils/unbuild';

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/module',
    { input: 'src/runtime/', outDir: 'dist/runtime', ext: 'mjs' }
  ],
  hooks: {
    'rollup:done': fixDeclarationPathWhenStub
  }
  // rollup: {
  //   emitCJS: true,
  //   cjsBridge: true
  // },
  // hooks: {
  //   async "rollup:done"(ctx) {
  //     await writeCJSStub(ctx.options.outDir);
  //   }
  // }
});

// async function writeCJSStub(distDir) {
//   const cjsStubFile = resolve(distDir, "module.cjs");
//   if (existsSync(cjsStubFile)) {
//     return;
//   }
//   const cjsStub = `module.exports = function(...args) {
//   return import('./module.mjs').then(m => m.default.call(this, ...args))
// }
// `;
//   await writeFile(cjsStubFile, cjsStub, "utf8");
// }
