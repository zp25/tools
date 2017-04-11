const chalk = require('chalk');

const helpOpts = `
  Options:

    - imagemin    图片优化
    - base64      base64编码／解码
`;

const imageminOpts = `
  Options:

    - webp        webp输出
    - compress    压缩图片
`;

const base64Opts = `
  Commands:

    - encode
    - decode

  Encoding:

    - utf8       default
    - utf16le
`;

const help = {
  help: {
    usage: 'node help [options]',
    options: helpOpts,
  },
  imagemin: {
    usage: 'node imagemin [options]',
    options: imageminOpts,
  },
  base64: {
    usage: 'node base64 <command> <string> [encoding]',
    options: base64Opts,
  },
};

const commands = Object.keys(help);

const opt = process.argv[2];
const getHelp = commands.includes(opt) ? help[opt] : help.help;

// output
console.log(`\n  Usage: ${getHelp.usage}`);

console.log(getHelp.options);

console.log(`  Source: ${chalk.bold('https://github.com/zp25/tools')}\n`);