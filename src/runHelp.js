const chalk = require('chalk');

const helpOpts = `
  Commands:

    - base64\tbase64编码/解码
    - imagemin\t图片优化
    - today\t当前日期
`;

const base64Opts = `
  Commands:

    - encode
    - decode

  Options:

    --encoding=${chalk.underline('ENCODING')}\t编码方式，默认utf8，可选utf16le等
`;

const imageminOpts = `
  Commands:

    - webp\twebp输出
    - compress\t压缩图片

  Options:

    --input=${chalk.underline('PATH')}\t自定义输入目录，默认./input
    --output=${chalk.underline('PATH')}\t自定义输出目录，默认./output
    --quality=${chalk.underline('NUMBER')}\t自定义图片质量，默认75

    --optipng\t压缩png时使用imagemin-optipng
`;

const todayOpts = `
  Options:

    --gwt\tGreenwich Mean Time
`;

const help = {
  help: {
    usage: 'tools <command> -h',
    options: helpOpts,
  },
  base64: {
    usage: 'tools base64 <command> <string> <options>',
    options: base64Opts,
  },
  imagemin: {
    usage: 'tools imagemin <command> <options>',
    options: imageminOpts,
  },
  today: {
    usage: 'tools today <options>',
    options: todayOpts,
  },
};

module.exports = (opt) => {
  const {
    usage,
    options,
  } = {}.hasOwnProperty.call(help, opt) ? help[opt] : help.help;

  return `
  Usage: ${usage}
${options || ''}
  Source: ${chalk.bold('https://github.com/zp25/tools')}
`;
};
