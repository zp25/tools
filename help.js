const chalk = require('chalk');

const helpOpts = `
  Options:

    - imagemin    图片优化
    - base64      base64编码／解码
`;

const imageminOpts = `
  Commands:

    - webp        webp输出
    - compress    压缩图片

  Options:

    --pngquant    默认，使用imagemin-pngquant
    --optipng     使用imagemin-optipng
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
    usage: 'node imagemin [command] [options]',
    options: imageminOpts,
  },
  base64: {
    usage: 'node base64 <command> <string> [encoding]',
    options: base64Opts,
  },
};

const opt = process.argv[2];
const getHelp = {}.hasOwnProperty.call(help, opt) ? help[opt] : help.help;

// output
const { usage, options } = getHelp;

console.log(`\n  Usage: ${usage}`);
console.log(options);

console.log(`  Source: ${chalk.bold('https://github.com/zp25/tools')}\n`);
