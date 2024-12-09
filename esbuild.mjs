import { argv } from 'process';
import * as esbuild from 'esbuild';
import { solidPlugin } from 'esbuild-plugin-solid';
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';

/** @type {esbuild.SameShape<esbuild.BuildOptions, esbuild.BuildOptions>} */
const options = {
  entryPoints: [
    './src/popup/index.html',
    './src/popup/index.tsx',
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
    '.css': 'copy',
  },
  plugins: [solidPlugin(), tailwindPlugin({})],
};

if (argv[2] === '--watch') {
  let ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching...');
} else {
  await esbuild.build(options);
}
