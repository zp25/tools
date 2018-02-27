const should = require('chai').should();
const { filesize } = require('../utils');

describe('filesize', () => {
  it('文件小于1KiB时返回false', () => {
    const size = 1023;
    const result = filesize(size);

    result.should.be.false;
  });

  it('文件大于等于1024GiB时返回GiB', () => {
    const sizes = [Math.pow(1024, 4), Math.pow(1024, 4) + 1];
    const result = sizes.map(size => filesize(size).slice(-3));

    result.should.satisfy(units => units.every(unit => unit === 'GiB'));
  });

  it('正确转换其他大小的单位', () => {
    const sizes = [
      1024,
      1024 + 1,
      Math.pow(1024, 2),
      Math.pow(1024, 2) + 1,
      Math.pow(1024, 3),
      Math.pow(1024, 3) + 1,
    ];
    const compare = ['KiB', 'KiB', 'MiB', 'MiB', 'GiB', 'GiB'];
    const cb = (val, index) => val[0] < 1024 && val[1] === compare[index];

    const result = sizes.map((size) => {
      const r = filesize(size);

      return [Number(r.slice(0, -3)), r.slice(-3)];
    });

    result.should.satisfy(vals => vals.every(cb));
  });
});
