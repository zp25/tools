#!/usr/bin/env node

const ora = require('ora');
const runHelp = require('../src/runHelp');
const runBase64 = require('../src/runBase64');
const runImagemin = require('../src/runImagemin');
const runToday = require('../src/runToday');
const runZxcvbn = require('../src/runZxcvbn');

const { interrupt } = require('../utils/parse');
const { InvalidScriptError, InterruptError } = require('../utils/errors');

const output = (result, {
  spinner,
  type,
}) => {
  if (type === 'stop') {
    spinner.stop();
    console.log(result);
  } else if (type === 'info') {
    spinner.info(result);
  } else if (type === 'warn') {
    spinner.warn(reuslt);
  } else if (type === 'fail') {
    spinner.fail(result);
  } else {
    spinner.succeed(result);
  }
}

const main = async (script, method, input) => {
  const spinner = ora('processing').start();

  try {
    if (script === 'base64') {
      output(runBase64(method, input), { spinner });
    } else if (script === 'imagemin') {
      const result = await runImagemin(method, input);
      output(result, { spinner });
    } else if (script === 'today') {
      // 仅接收一个option
      output(runToday(method), { spinner, type: 'stop' });
    } else if (script === 'zxcvbn') {
      // 需接收password，可接收一个option
      output(runZxcvbn([method, ...input]), { spinner, type: 'stop' });
    } else if (script === undefined || interrupt(script)) {
      throw new InterruptError();
    } else {
      throw new InvalidScriptError(`invalid script '${script}'`);
    }
  } catch(err) {
    const { message, script: helpOpt } = err;

    // 不是程序运行失败
    if (err instanceof InterruptError) {
      output(runHelp(helpOpt), { spinner, type: 'stop' });
      return;
    }

    if (err instanceof InvalidScriptError) {
      output(message, { spinner, type: 'fail' });
    } else {
      output(`${script}: ${message}`, { spinner, type: 'fail' });
    }

    output('Try \'tools -h\' for more information.', {
      spinner,
      type: 'info',
    });
  }
};

if (require.main === module) {
  const argv = process.argv.slice(2);
  const [script, method, ...input] = argv;

  main(script, method, input);
}
