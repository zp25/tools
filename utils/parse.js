/** @module parse */

const { InvalidOptionError } = require('./errors');

/**
 * 是否需要打断运行
 * @param {string} check - 需判断内容
 * @return {boolean}
 */
const interrupt = check => check === '-h' || check === '--help';

/**
 * 查找合法选项的描述
 * @param {Object.<string, string|string[]>} optsMap - 查询表
 * @param {string} opt - 需要查询的选项
 * @return {string|undefined} - 返回合法选项的描述，或查询不到结果返回undefined
 */
const findOptionDescription = (optsMap, opt) => {
  const [result] = Object.entries(optsMap)
    .find(([key, list]) => (
      Array.isArray(list)
        ? list.includes(opt)
        : list === opt
    )) || [];

  return result;
};

const REGEXP_DASHOPT = /^-|--/;

/**
 * 将配置整理成统一的查询表
 * @description 以统一规则整理查询表，并提示不支持的配置，无法判断配置对应的值是否合法
 * @param {Object.<string, string|string[]>} [optsMap={}] - 合法选项查询表
 * @param {string[]} [input=[]] - 选项和配置组成的数组
 * @return {Object}
 * @throws {InvalidOptionError} 存在非法选项将抛出错误
 */
const getConfig = (optsMap = {}, input = []) => {
  const list = Array.isArray(input) ? input : [input];

  return list.reduce((prev, item) => {
    const [opt, val] = REGEXP_DASHOPT.test(item)
      ? item.split('=')
      : ['', item];

    const description = findOptionDescription(optsMap, opt);

    if (!description) {
      throw new InvalidOptionError(`invalid option '${item}'`);
    }

    // 非dash opt需要特殊处理，通常这些是关键配置，所以尽量保留所有输入
    if (!opt) {
      const prevVal = prev[description];

      return Object.assign({}, prev, {
        [description]: prevVal ? prevVal.concat(val) : [val],
      });
    }

    return Object.assign({}, prev, { [description]: val || true });
  }, {});
};

module.exports = {
  interrupt,
  getConfig,
  findOptionDescription,
};
