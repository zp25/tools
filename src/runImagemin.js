const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { interrupt, getConfig } = require('../utils/parse');
const filesize = require('../utils/filesize');
const { InvalidMethodError, InterruptError } = require('../utils/errors');
const { webp, compress } = require('./imagemin');

/**
 * 获取imagemin配置
 * @param {Array.<string>} input - 选项和配置组成的数组
 * @return {Object.<string, string>} 有效的配置
 * @ignore
 */
const resolveImageminConfig = (input = []) => {
  const optsMap = {
    input: ['-i', '--input'],
    output: ['-o', '--output'],
    quality: ['-q', '--quality'],
    optipng: '--optipng',
  };

  return getConfig(optsMap, input);
};

/**
 * 统一文件大小输出格式
 * @param {number} size - 文件大小
 * @return {string}
 */
const hint = (size, warning = false) => {
  const color = warning ? chalk.red : chalk.green;
  const result = color(filesize(size));

  return size > 1024 ? `${size}B (${result})` : result;
};

/**
 * 反馈信息
 * @param {Object[]} files - imagemin返回结果
 * @param {Buffer} files[].data - 文件二进制数据
 * @param {string} files[].sourcePath - 文件输入路径
 * @param {string} files[].destinationPath - 文件输出路径
 * @param {boolean} [compare=false] - 是否显示原文件大小
 * @return {Array.<Promise>}
 */
const info = (files, { compare }) => files.map((file) => {
  const {
    data: {
      length: dstSize,
    },
    sourcePath,
  } = file;

  const fnameHint = chalk.blue(path.basename(sourcePath));

  if (compare) {
    return new Promise((resolve, reject) => {
      fs.stat(sourcePath, (err, { size }) => {
        if (err) {
          reject(err);
          return;
        }

        const srcHint = hint(size);
        const dstHint = hint(dstSize, dstSize > size);

        resolve(`\t${fnameHint}: ${srcHint} -> ${dstHint}`);
      });
    });
  } else {
    const dstHint = hint(dstSize);

    return Promise.resolve(`\t${fnameHint}: ${dstHint}`);
  }
});

const runImagemin = async (method, config) => {
  if (!method) {
    throw new InvalidMethodError(`empty method`);
  }

  if (interrupt(method)) {
    throw new InterruptError('interrupt', 'imagemin');
  }

  const methods = ['webp', 'compress'];

  if (!methods.includes(method)) {
    throw new InvalidMethodError(`invalid method '${method}'`);
  }

  const {
    input = './input',
    output = './output',
    quality = '75',
    optipng = false,
  } = resolveImageminConfig(config);

  const handler = method === 'webp' ? webp : compress;
  // 暂时不支持子目录
  const pattern = `${input}/*.{jpg,jpeg,png,svg}`;

  const files = await handler(pattern, output, {
    quality,
    optipng,
  });

  const result = await Promise.all(info(files, {
    compare: method === 'compress',
  }));

  return `${method}:\n${result.join('\n')}`;
};

module.exports = runImagemin;
