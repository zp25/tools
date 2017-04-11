const StringDecoder = require('string_decoder').StringDecoder;

const encodeBase64 = (str, encoding='utf8') => {
  const buf = Buffer.from(str, encoding);

  return buf.toString('base64');
};

const decodeBase64 = (str, encoding='utf8') => {
  const buf = Buffer.from(str, 'base64');
  const decoder = new StringDecoder(encoding);

  return decoder.end(buf);
};

if (require.main === module) {
  const opts = process.argv.slice(2);
  const [method, str, encoding='utf8'] = opts;

  let result = str;

  if (method === 'encode') {
    result = encodeBase64(str, encoding);
  } else if (method === 'decode') {
    result = decodeBase64(str, encoding);
  }

  // 输出
  console.log(`\n${result}\n`);
} else {
  module.exports = { encodeBase64, decodeBase64 };
}
