import react from 'react'
import reactDom from 'react-dom'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import cssbundle from 'rollup-plugin-css-bundle'
import svgr from '@svgr/rollup'
import autoprefixer from 'autoprefixer'

import pkg from './package.json'

export default {
  // external: ['tinymce', '@tinymce/tinymce-react'],
  external: ['@material-ui/core', '@material-ui/icons', '@material-ui/lab', '@material-ui/pickers'],
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      plugins: [
        cssbundle({
          transform: code => postcss([autoprefixer]).process(code, {})
        })
      ]
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    resolve(),
    babel({ runtimeHelpers: true }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['ForwardRef', 'Memo', 'isFragment'],
        react: Object.keys(react),
        'react-dom': Object.keys(reactDom)
      }
    })
  ]
}
