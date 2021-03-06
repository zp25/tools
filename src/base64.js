/** @module base64 */

const StringDecoder = require('string_decoder').StringDecoder;

/**
 * base64编码
 * @param {string} str - 需编码字符串
 * @param {string} [encoding='utf8'] - 字符串编码方式
 * @return {string} base64编码字符串
 */
const encodeBase64 = (str, encoding='utf8') => {
  const buf = Buffer.from(str, encoding);

  return buf.toString('base64');
};

/**
 * base64解码
 * @param {string} str - 需解码base64字符串
 * @param {string} [encoding='utf8'] - 原字符串编码方式
 * @return {string} base64解码符串
 */
const decodeBase64 = (str, encoding='utf8') => {
  const buf = Buffer.from(str, 'base64');
  const decoder = new StringDecoder(encoding);

  return decoder.end(buf);
};

module.exports = {
  encodeBase64,
  decodeBase64,
};
