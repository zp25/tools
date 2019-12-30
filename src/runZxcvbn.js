const zxcvbn = require('zxcvbn');
const { interrupt, getConfig } = require('../utils/parse');
const { InvalidOptionError, InterruptError } = require('../utils/errors');

/**
 * 获取zxcvbn配置
 * @param {Array.<string>} config - 选项和配置组成的数组
 * @return {Object.<string, string>} 有效的配置
 * @ignore
 */
const resolveZxcvbnConfig = (config = []) => {
  const optsMap = {
    password: '',
    verbose: ['-v', '--verbose'],
  };

  return getConfig(optsMap, config);
};

const simplify = ({
  password,
  score,
  feedback: {
    warning,
    suggestions,
  },
}) => `
  password:\t${password}
  score:\t${score}
  warning:\t${warning}
  suggestions:\n${suggestions.map(s => `\t${s}`).join('\n')}
`;

const runZxcvbn= (config = []) => {
  if (!config[0] || interrupt(config[0])) {
    throw new InterruptError('interrupt', 'zxcvbn');
  }

  const { password, verbose } = resolveZxcvbnConfig(config);

  if (!password) {
    throw new InvalidOptionError('empty content');
  }

  const result = zxcvbn(password[0]);

  return verbose ? result : simplify(result);
};

module.exports = runZxcvbn;
