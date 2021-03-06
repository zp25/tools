const { interrupt, getConfig } = require('../utils/parse');
const {
  InvalidMethodError,
  InvalidOptionError,
  InterruptError,
} = require('../utils/errors');
const { encodeBase64, decodeBase64 } = require('./base64');

/**
 * 获取base64配置
 * @param {Array.<string>} config - 选项和配置组成的数组
 * @return {Object.<string, string>} 有效的配置
 * @ignore
 */
const resolveBase64Config = (config = []) => {
  const optsMap = {
    text: '',
    encoding: ['-e', '--encoding'],
  };

  return getConfig(optsMap, config);
};

const runBase64 = (method, config) => {
  if (!method || interrupt(method)) {
    throw new InterruptError('interrupt', 'base64');
  }

  const methods = ['encode', 'decode'];

  if (!methods.includes(method)) {
    throw new InvalidMethodError(`invalid method '${method}'`);
  }

  const {
    text,
    encoding = 'utf8',
  } = resolveBase64Config(config);

  if (!text) {
    throw new InvalidOptionError('empty content');
  }

  const handler = method === 'encode' ? encodeBase64 : decodeBase64;
  const str = text[0];

  return handler(str, encoding);
};

module.exports = runBase64;
