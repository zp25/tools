/** @module imagemin */

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

/**
 * 输出webp
 * @param {string|string[]} input - 支持minimatch patterns
 * @param {string} output - 输出路径
 * @param {Object} [config] - 配置
 * @param {string} [config.quality='75'] - 设置jpg图片质量
 * @return {Promise}
 */
const webp = (input, output, config = {}) => {
  const patterns = Array.isArray(input) ? input : [input];
  const {
    quality = '75',
  } = config;

  return imagemin(patterns, {
    destination: output,
    plugins: [
      imageminWebp({
        quality,
        alphaQuality: 100,
        method: 4, // compression method, 0 (fastest) and 6 (slowest)
      }),
    ]
  });
};

/**
 * 压缩图片
 * @param {Array.<string>} input - 支持minimatch patterns
 * @param {string} output - 输出路径
 * @param {Object} [config] - 配置
 * @param {string} [config.quality='75'] - 设置jpg图片质量
 * @param {boolean} [config.optipng=false] - 是否使用imagemin-optipng
 * @return {Promise}
 */
const compress = (input, output, config = {}) => {
  const patterns = Array.isArray(input) ? input : [input];
  const {
    quality = '75',
    optipng = false,
  } = config;

  return imagemin(patterns, {
    destination: output,
    plugins: [
      imageminMozjpeg({
        progressive: true,
        quality,
      }),
      imageminSvgo(),
      ...(optipng ? [imageminOptipng()] : [imageminPngquant({
        quality: [0.3, 0.5]
      })])
    ]
  });
};

module.exports = { webp, compress };
