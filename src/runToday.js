const { interrupt } = require('../src/parse');
const date = require('../index').cal;
const {
  InterruptError,
} = require('../src/errors');

/**
 * 毫秒时间戳转秒
 * @param {Date} d - 时间对象
 * @return {number}
 * @throws {Error} 数据格式不合规
 */
const mstos = d => {
  if (!(d instanceof Date)) {
    throw new Error('not a Date');
  }

  return Math.floor(d.valueOf() / 1000);
};

const runToday = (method) => {
  if (interrupt(method)) {
    throw new InterruptError('interrupt', 'today');
  }

  const ts = mstos(new Date());
  const {
    gregorian,
    julian,
  } = date(ts);

  return `\n\t格里历\t${gregorian}\n\t儒略历\t${julian}\n`;
};

module.exports = runToday;
