const should = require('chai').should();
const date = require('../src/cal');

describe('date', () => {
  it('参数接收number，计算范围1901-2099年，超出范围抛出Error', () => {
    const h = Date.UTC(2099, 11, 31, 23, 59, 59, 999);
    const l = Date.UTC(1901, 0, 1);

    const testNum = () => { date(h.toString()); };
    const testH = () => { date(h + 1); };
    const testL = () => { date(l - 1); };

    testNum.should.throw(Error);
    testH.should.throw(Error);
    testL.should.throw(Error);
  });

  it('返回儒略历时间和格里历时间，时区Asia/Shanghai', () => {
    const tests = [
      {
        ts: Date.UTC(1901, 0, 1),
        result: {
          gregorian: 'Tue, Jan 1, 1901',
          julian: 'Tue, Dec 19, 1900',
        },
      },
      {
        ts: Date.UTC(2000, 1, 29),
        result: {
          gregorian: 'Tue, Feb 29, 2000',
          julian: 'Tue, Feb 16, 2000',
        },
      },
      {
        ts: Date.UTC(2099, 11, 31, 23, 59, 59, 999),
        result: {
          gregorian: 'Fri, Jan 1, 2100',
          julian: 'Fri, Dec 19, 2099',
        },
      },
    ];

    tests.forEach(({
      ts,
      result,
    }) => {
      date(ts).should.eql(result);
    });
  });

  it('可设置时区', () => {
    const ts = Date.UTC(2099, 11, 31, 23, 59, 59, 999);
    const result = {
      gregorian: 'Thu, Dec 31, 2099',
      julian: 'Thu, Dec 18, 2099',
    };

    date(ts, 'America/Danmarkshavn').should.eql(result);
  });
});
