/**
 * 非法命令
 * @param {string} message
 * @ignore
 */
function InvalidScriptError(message) {
  this.name = 'InvalidScriptError';
  this.message = message || 'invalid script';
}

InvalidScriptError.prototype = Object.create(Error.prototype);
InvalidScriptError.prototype.constructor = InvalidScriptError;

/**
 * 非法方法
 * @param {string} message
 * @ignore
 */
function InvalidMethodError(message) {
  this.name = 'InvalidMethodError';
  this.message = message || 'invalid method';
}

InvalidMethodError.prototype = Object.create(Error.prototype);
InvalidMethodError.prototype.constructor = InvalidMethodError;

/**
 * 非法选项
 * @param {string} message
 * @ignore
 */
function InvalidOptionError(message) {
  this.name = 'InvalidOptionError';
  this.message = message || 'invalid option';
}

InvalidOptionError.prototype = Object.create(Error.prototype);
InvalidOptionError.prototype.constructor = InvalidOptionError;

/**
 * 程序运行被打断
 * @param {string} message
 * @ignore
 */
function InterruptError(message, script) {
  this.name = 'InterruptError';
  this.message = message || 'interrupt';
  this.script = script;
}

InterruptError.prototype = Object.create(Error.prototype);
InterruptError.prototype.constructor = InterruptError;

module.exports = {
  InvalidScriptError,
  InvalidMethodError,
  InvalidOptionError,
  InterruptError,
};
