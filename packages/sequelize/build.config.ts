import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index',
    'src/extra'
  ],
  rollup: {
    emitCJS: true
  }
});
