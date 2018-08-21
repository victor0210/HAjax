import babel from 'rollup-plugin-babel'

export default {
  input: 'src/majax.js',
  output: {
    file: 'bundle.js',
    format: 'esm'
  },
  plugins: [
    babel()
  ]
}
