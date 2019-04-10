/** @module cal */

/**
 * 当前日期
 * @desc 仅1901-2099年
 * @param {number} ts - 秒级时间戳
 * @return {Object}
 * @throws {Error} 参数错误
 */
function date(ts) {
  if (
    typeof ts !== 'number'
    || ts < -2177452800 // 1901
    || ts > 4102444799 // 2099
  ) {
    throw new Error('参数错误');
  }

  const gregorian = new Date(ts * 1000).toDateString();
  const day = gregorian.slice(0, 3);

  const julian = new Date((ts - 13 * 24 * 3600) * 1000).toDateString();

  return {
    gregorian,
    julian: `${day} ${julian.slice(4)}`,
  };
}

module.exports = date;
