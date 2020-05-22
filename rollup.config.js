import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/index',
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'reactDirective',
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
      main: true,
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: ['react'],
}
