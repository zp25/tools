/** @module imagemin */

const path = require('path');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
// const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const { filesize } = require('./utils');

const input = path.resolve(__dirname, 'input/images');
const output = path.resolve(__dirname, 'output/images');

/**
 * 反馈信息
 * @private
 * @param {Object[]} files - imagemin返回结果
 * @param {string} files[].path - 文件路径
 * @param {Buffer} files[].data - 文件二进制数据
 */
const info = (files) => {
  files.forEach((file) => {
    const size = filesize(file.data.length);
    const hint = size ? `(${size})` : '';

    console.log(`${path.basename(file.path)}: ${file.data.length}bytes ${hint}`);
  });
}

/**
 * 输出webp
 */
const webp = async () => {
  try {
    const files = await imagemin([`${input}/*.{jpg,png}`], output, {
      plugins: [
        imageminWebp({
          quality: 75,
          alphaQuality: 100,
          method: 4, // compression method, 0 (fastest) and 6 (slowest)
        }),
      ]
    });

    info(files);
  } catch(err) {
    console.log(`webp: ${err.message}`);
  }
};

/**
 * 压缩图片
 */
const compress = async () => {
  try {
    const files = await imagemin([`${input}/*.{jpg,png,svg}`], output, {
      plugins: [
        imageminMozjpeg({
          progressive: true,
        }),
        imageminOptipng(),
        // imageminPngquant(),
        imageminSvgo(),
      ]
    });

    info(files);
  } catch(err) {
    console.log(`compress: ${err.message}`);
  }
};

if (require.main === module) {
  const opts = process.argv.slice(2);

  if (opts.length === 0) {
    webp();
    compress();
  } else {
    opts.includes('webp') && webp();
    opts.includes('compress') && compress();
  }
} else {
  module.exports = { webp, compress };
}
