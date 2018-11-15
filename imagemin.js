/** @module imagemin */

const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const chalk = require('chalk');
const ora = require('ora');

const { filesize } = require('./utils');

const input = path.resolve(__dirname, 'input/images');
const output = path.resolve(__dirname, 'output/images');

/**
 * 统一文件大小输出格式
 * @param {number} size - 文件大小
 * @return {string}
 */
const hint = (size) => {
  const result = chalk.green(filesize(size));

  return size > 1024 ? `${size}B (${result})` : result;
};

/**
 * 反馈信息
 * @param {Object[]} files - imagemin返回结果
 * @param {string} files[].path - 文件路径
 * @param {Buffer} files[].data - 文件二进制数据
 * @param {boolean} [compare=false] - 是否显示原文件大小
 * @return {Array.<Promise>}
 */
const info = (files, compare = false) => files.map((file) => {
  const {
    data: {
      length: dstSize,
    },
    path: filePath,
  } = file;

  const dstHint = hint(dstSize);

  const fname = path.basename(filePath);
  const fnameHint = chalk.blue(fname);

  if (compare) {
    return new Promise((resolve, reject) => {
      fs.stat(`${input}/${fname}`, (err, stat) => {
        if (err) {
          reject(err);
          return;
        }

        const srcHint = hint(stat.size);

        resolve(`\t${fnameHint}: ${srcHint} -> ${dstHint}`);
      });
    });
  } else {
    return Promise.resolve(`\t${fnameHint}: ${dstHint}`);
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
  const spinner = ora('processing webp').start();

  try {
    const files = await webp(patterns);
    const result = await Promise.all(info(files));

    spinner.succeed(`webp:\n${result.join('\n')}`);
  } catch(err) {
    spinner.fail(`webp: ${chalk.red(err.message)}`);
  }
};

/**
 * 压缩图片
 * @param {Array.<string>} patterns - minimatch
 * @param {boolean} [optipng=false] - 是否使用imagemin-optipng
 * @return {Promise}
 */
const compress = (patterns, optipng = false) => imagemin(patterns, output, {
  plugins: [
    imageminMozjpeg({
      progressive: true,
      quality: 80,
    }),
    imageminSvgo(),
    ...(optipng ? [imageminOptipng()] : [imageminPngquant()])
  ]
});

/**
 * 运行compress
 * @private
 */
const runCompress = async (optipng) => {
  const patterns = [`${input}/*.{jpg,jpeg,png,svg}`];
  const spinner = ora('processing compress').start();

  try {
    const files = await compress(patterns, optipng);
    const result = await Promise.all(info(files, true));

    spinner.succeed(`compress:\n${result.join('\n')}`);
  } catch(err) {
    spinner.fail(`compress: ${chalk.red(err.message)}`);
  }
};

if (require.main === module) {
  const args = process.argv.slice(2);

  let opts = [];
  const cmd = args.reduce((prev, d) => {
    const stdd = d.toLowerCase();

    if (/^--\w+/.test(d)) {
      opts = opts.concat(stdd);

      return prev;
    }

    return prev.concat(stdd);
  }, []);

  const useOptipng = opts.includes('--optipng');

  if (cmd.length === 0) {
    runWebp();
    runCompress(useOptipng);
  } else {
    cmd.includes('webp') && runWebp();
    cmd.includes('compress') && runCompress(useOptipng);
  }
} else {
  module.exports = { webp, compress };
}
