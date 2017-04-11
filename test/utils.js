const should = require('chai').should();
const { filesize } = require('../utils');

describe('filesize', () => {
  it('文件小于1kb时应该返回false', () => {
    const size = 1024 - 42;
    const result = filesize(size);

    result.should.be.false;
  });

  it('文件大于等于1024gb时应该返回gb', () => {
    const sizes = [Math.pow(1024, 4), Math.pow(1024, 4) + 42];
    const result = sizes.map(size => filesize(size).slice(-2).toLowerCase());

    result.should.satisfy(units => units.every(unit => unit === 'gb'));
  });

  it('正确转换其他大小的文件', () => {
    const sizes = [
      1024,
      1024 + 42,
      Math.pow(1024, 2),
      Math.pow(1024, 2) + 42,
      Math.pow(1024, 3),
      Math.pow(1024, 3) + 42,
    ];
    const compare = ['kb', 'kb', 'mb', 'mb', 'gb', 'gb'];
    const cb = (val, index) => val[0] < 1024 && val[1] === compare[index];

    const result = sizes.map((size) => {
      const r = filesize(size);

      return [Number(r.slice(0, -2)), r.slice(-2).toLowerCase()];
    });

    result.should.satisfy(vals => vals.every(cb));
  });
});
