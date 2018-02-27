const should = require('chai').should();
const { filesize } = require('../utils');

describe('filesize', () => {
  it('文件小于1KiB时返回字节数', () => {
    const size = 1023;
    const result = filesize(size);

    result.should.be.equal(`${size}B`);
  });

  it('文件大于等于1024GiB时返回GiB', () => {
    const sizes = [
      Math.pow(1024, 4),
      Math.pow(1024, 4) + 1,
    ];
    const result = sizes.map(size => filesize(size).slice(-3));

    result.should.satisfy(units => units.every(unit => unit === 'GiB'));
  });

  it('正确转换其他大小的单位，保留两位小数', () => {
    const sizes = [
      1024,
      1024 + 42,
      Math.pow(1024, 2),
      Math.pow(1024, 2) + 1,
      Math.pow(1024, 3),
      Math.pow(1024, 3) + 1,
    ];
    const compare = [
      '1.00KiB',
      '1.04KiB',
      '1.00MiB',
      '1.00MiB',
      '1.00GiB',
      '1.00GiB',
    ];

    const result = sizes.map((size) => {
      const r = filesize(size);

      return r;
    });

    result.should.be.eql(compare);
  });
});
