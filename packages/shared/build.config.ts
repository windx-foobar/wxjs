import { defineBuildConfig } from 'unbuild';
import { fixDeclarationPathWhenStub } from '../../_utils/unbuild';

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index'
  ],
  rollup: {
    emitCJS: true
  },
  hooks: {
    'rollup:done': fixDeclarationPathWhenStub
  }
});
