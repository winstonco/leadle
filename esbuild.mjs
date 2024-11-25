import { argv } from 'process';
import * as esbuild from 'esbuild';

const options = {
  entryPoints: [
    './src/assets/**',
    './src/scripts/**/*.ts',
    './src/service-worker.ts',
    './src/manifest.json',
  ],
  bundle: true,
  // minify: true,
  outdir: 'out',
  loader: {
    '.json': 'copy',
    '.html': 'copy',
    '.png': 'copy',
  },
};

if (argv[2] === '--watch') {
  let ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching...');
} else {
  await esbuild.build(options);
}
