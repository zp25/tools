/** @module filesize */

/**
 * 文件大小使用合适的单位表示
 * @param {number} size - 文件大小，Bytes
 * @return {string} 若文件小于1KiB返回false，最大单位GiB
 */
const filesize = (size) => {
  const units = ['B', 'KiB', 'MiB', 'GiB'];
  const limit = units.length - 1;
  let r = size;

  let i = 0;
  for (; r >= 1024 && i < limit; i++) {
    r /= 1024;
  }

  return (i === 0 ? r : r.toFixed(2)) + units[i];
};

module.exports = filesize;
