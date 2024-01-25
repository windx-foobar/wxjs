import fsp from 'node:fs/promises';
import { type BuildContext } from 'unbuild';
import { relative } from 'node:path';

export async function fixDeclarationPathWhenStub(ctx: BuildContext) {
  if (!ctx.options.declaration) return;

  if (ctx.options.stub) {
    const { outDir } = ctx.options;

    await Promise.all(
      ctx.options.entries
        .filter((entry) => entry.builder !== 'mkdist')
        .map(async (entry) => {
          const dtsOutDir = `${outDir}/${entry.name}.d.ts`;
          const relativeDistToSrc = relative(outDir, entry.input);
          const content = (await fsp.readFile(dtsOutDir)).toString();

          await fsp.writeFile(dtsOutDir, content.replace(/from\s.*/g, `from "${relativeDistToSrc}";`));
        })
    );
  }
}
