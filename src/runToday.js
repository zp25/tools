const { interrupt, getConfig } = require('../src/parse');
const date = require('../index').cal;
const { InterruptError } = require('../src/errors');

/**
 * 获取date配置
 * @param {Array.<string>} config - 选项和配置组成的数组
 * @return {Object.<string, string>} 有效的配置
 * @ignore
 */
const resolveDateConfig = (config = []) => {
  const optsMap = {
    gmt: '--gmt',
  };

  return getConfig(optsMap, config);
};

const runToday = (method) => {
  if (interrupt(method)) {
    throw new InterruptError('interrupt', 'today');
  }

  const { gmt } = resolveDateConfig(method ? [method] : []);

  const {
    gregorian,
    julian,
  } = date(Date.now(), gmt && 'America/Danmarkshavn');

  return `\n\t格里历\t${gregorian}\n\t儒略历\t${julian}\n`;
};

module.exports = runToday;
