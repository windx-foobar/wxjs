import { defineBuildConfig } from 'unbuild';
import { fixDeclarationPathWhenStub } from '../../_utils/unbuild';

export default defineBuildConfig({
  declaration: false,
  entries: ['./src/cli'],
  hooks: {
    'rollup:done': fixDeclarationPathWhenStub
  }
});
