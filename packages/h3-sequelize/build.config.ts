import { defineBuildConfig } from 'unbuild';
import { fixDeclarationPathWhenStub } from '../../_utils/unbuild';

export default defineBuildConfig({
  hooks: {
    'rollup:done': fixDeclarationPathWhenStub
  }
});
