const { interrupt, getConfig } = require('../utils/parse');
const { InterruptError } = require('../utils/errors');
const date = require('./cal');

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

/**
 * @param {string} method - today命令仅有一个配置信息
 */
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
