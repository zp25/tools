#!/usr/bin/env node

/**
 * 名词解释：
 * input：命令行输入
 * option|选项：输入中以-或--起始的部分
 * value|选项的值：选项紧跟的=后方部分，或没有时为true
 * description|选项的描述：选项在查询表中对应的键值
 * config：依照用户输入得到的配置，为Object
 * @ignore
 */

const ora = require('ora');
const runHelp = require('../src/runHelp');
const runBase64 = require('../src/runBase64');
const runImagemin = require('../src/runImagemin');
const { interrupt } = require('../src/parse');
const {
  InvalidScriptError,
  InterruptError,
} = require('../src/errors');

const main = async (script, method, input) => {
  const spinner = ora('processing').start();

  try {
    let result = '';

    if (script === 'base64') {
      result = runBase64(method, input);
    } else if (script === 'imagemin') {
      result = await runImagemin(method, input);
    } else if (interrupt(script)) {
      throw new InterruptError();
    } else {
      throw new InvalidScriptError(`invalid script '${script}'`);
    }

    spinner.succeed(result);
  } catch(err) {
    const { message, script: helpOpt } = err;

    // 不是程序运行失败
    if (err instanceof InterruptError) {
      spinner.stop();
      console.log(runHelp(helpOpt));
      return;
    }

    if (err instanceof InvalidScriptError) {
      spinner.fail(message);
    } else {
      spinner.fail(`${script}: ${message}`);
    }

    spinner.info('Try \'tools -h\' for more information.');
  }
};

if (require.main === module) {
  const argv = process.argv.slice(2);
  const [script, method, ...input] = argv;

  main(script, method, input);
}
