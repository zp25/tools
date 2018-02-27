/** @module imagemin */

const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
// const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const chalk = require('chalk');

const { filesize } = require('./utils');

const input = path.resolve(__dirname, 'input/images');
const output = path.resolve(__dirname, 'output/images');

/**
 * 反馈信息
 * @param {Object[]} files - imagemin返回结果
 * @param {string} files[].path - 文件路径
 * @param {Buffer} files[].data - 文件二进制数据
 * @param {boolean} [compare=false] - 是否显示原文件大小
 * @return {Array.<(Promise|string)>}
 */
const info = (files, compare = false) => files.map((file) => {
  const {
    data,
    path: filePath,
  } = file;

  const size = chalk.green(filesize(data.length));
  const hint = data.length > 1024 ? `${data.length}B (${size})` : size;
  const filename = path.basename(filePath);

  if (compare) {
    return new Promise((resolve, reject) => {
      fs.stat(`${input}/${filename}`, (err, stat) => {
        if (err) {
          reject(err);
          return;
        }

        const srcSize = chalk.green(filesize(stat.size));
        const srcHint = stat.size > 1024 ? `${stat.size}B (${srcSize})` : srcSize;

        resolve(`\t${chalk.blue(filename)}: ${srcHint} -> ${hint}`);
      });
    });
  } else {
    return `\t${chalk.blue(filename)}: ${hint}`;
  }
});

/**
 * 输出webp
 * @param {Array.<string>} patterns - minimatch
 * @return {Promise}
 */
const webp = patterns => imagemin(patterns, output, {
  plugins: [
    imageminWebp({
      quality: 75,
      alphaQuality: 100,
      method: 4, // compression method, 0 (fastest) and 6 (slowest)
    }),
  ]
});

/**
 * 运行webp
 * @private
 */
const runWebp = async () => {
  const patterns = [`${input}/*.{jpg,png}`];

  try {
    const files = await webp(patterns);

    console.log(`webp:\n${info(files).join('\n')}`);
  } catch(err) {
    console.log(`webp: ${chalk.red(err.message)}`);
  }
};

/**
 * 压缩图片
 * @param {Array.<string>} patterns - minimatch
 * @return {Promise}
 */
const compress = patterns => imagemin(patterns, output, {
  plugins: [
    imageminMozjpeg({
      progressive: true,
    }),
    imageminOptipng(),
    // imageminPngquant(),
    imageminSvgo(),
  ]
});

/**
 * 运行compress
 * @private
 */
const runCompress = async () => {
  const patterns = [`${input}/*.{jpg,png,svg}`];

  try {
    const files = await compress(patterns);

    const result = await Promise.all(info(files, true));
    console.log(`compress:\n${result.join('\n')}`);
  } catch(err) {
    console.log(`compress: ${chalk.red(err.message)}`);
  }
};

if (require.main === module) {
  const opts = process.argv.slice(2);

  if (opts.length === 0) {
    runWebp();
    runCompress();
  } else {
    opts.includes('webp') && runWebp();
    opts.includes('compress') && runCompress();
  }
} else {
  module.exports = { webp, compress };
}
