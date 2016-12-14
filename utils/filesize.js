/**
 * 文件大小使用合适的单位表示
 * @param {Number} size 文件大小，Bytes
 * @return {(String|Boolean)} 转化结果，若小于1k返回false，最大单位gb
 */
const filesize = (size) => {
  const units = ['b', 'kb', 'mb', 'gb'];
  const limit = units.length - 1;
  let r = size;

  let i;
  for (i = 0; r >= 1024 && i < limit; i++) {
    r /= 1024;
  }

  return i === 0 ? false : r.toFixed(2) + units[i];
};

module.exports = filesize;
