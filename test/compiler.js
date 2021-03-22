import path from 'path';
import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.rhtml$/,
          use: [
            {
              loader: path.resolve(__dirname, '../src/loader.js'),
              options,
            },
          ],
        },

        /**
         * @see https://webpack.js.org/guides/asset-modules/
         */
        {
          test: /.(gif|jpg|jpeg|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, // eslint-disable-line no-useless-escape
          type: 'asset',
        },
      ],
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toJson().errors);

      resolve(stats);
    });
  });
};
