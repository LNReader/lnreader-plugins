const { minify_sync } = require('terser');
import * as fs from 'fs';

const config = {
  compress: {
    arrows: false,
    booleans_as_integers: true,
  },
  mangle: {},
  ecma: 5, // specify one of: 5, 2015, 2016, etc.
  enclose: false, // or specify true, or "args:values"
  keep_classnames: false,
  keep_fnames: false,
  module: true,
  toplevel: true,
};

export const minify = function (path: string) {
  const code = fs.readFileSync(path).toString();
  const result = minify_sync(code, config);
  fs.writeFileSync(path, result.code);
};
