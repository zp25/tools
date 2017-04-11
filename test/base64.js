const should = require('chai').should();
const { encodeBase64, decodeBase64 } = require('../base64');

describe('base64', () => {
  const raw = 'hello你好';
  const code = [
    'aGVsbG/kvaDlpb0=',
    'aABlAGwAbABvAGBPfVk=',
  ];

  it('正确使用base64编码utf8, utf16le字符串', () => {
    const result = [
      encodeBase64(raw),
      encodeBase64(raw, 'utf16le'),
    ];

    result.should.eql(code);
  });

  it('正确解码base64编码的字符串', () => {
    const compare = new Array(2).fill(raw);
    const result = [
      decodeBase64(code[0]),
      decodeBase64(code[1], 'utf16le'),
    ];

    result.should.eql(compare);
  });
});
