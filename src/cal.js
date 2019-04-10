/** @module cal */

const gap = 13 * 24 * 3600000;

/**
 * 当前日期
 * @desc 仅1901-2099年
 * @param {number} ts - 毫秒时间戳
 * @return {Object}
 * @throws {Error} 参数错误
 */
function date(ts, tz = 'Asia/Shanghai') {
  if (
    typeof ts !== 'number'
    || ts < Date.UTC(1901, 0, 1)
    || ts > Date.UTC(2099, 11, 31, 23, 59, 59, 999)
  ) {
    throw new Error('参数错误');
  }

  const config = {
    timeZone: tz,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const gregorian = new Date(ts).toLocaleDateString('en-US', config);
  const weekday = gregorian.slice(0, 4);

  const julian = new Date(ts - gap).toLocaleDateString('en-US', config);

  return {
    gregorian,
    julian: weekday + julian.slice(4),
  };
}

module.exports = date;
