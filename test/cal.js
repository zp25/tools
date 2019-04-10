const should = require('chai').should();
const date = require('../src/cal');

describe('date', () => {
  it('参数接收number，计算范围1901-2099年，超出范围抛出Error', () => {
    const h = new Date('2099-12-31 23:59:59 GMT').valueOf() / 1000;
    const l = new Date('1901-01-01 00:00:00 GMT').valueOf() / 1000;

    const testNum = () => { date(h.toString()); };
    const testH = () => { date(h + 1); };
    const testL = () => { date(l - 1); };

    testNum.should.throw(Error);
    testH.should.throw(Error);
    testL.should.throw(Error);
  });

  it('返回儒略历时间和格里历时间', () => {
    const tests = [
      {
        ts: -2177452800,
        result: {
          gregorian: 'Tue Jan 01 1901',
          julian: 'Tue Dec 19 1900',
        },
      },
      {
        ts: 951782400,
        result: {
          gregorian: 'Tue Feb 29 2000',
          julian: 'Tue Feb 16 2000',
        },
      },
      {
        ts: 1554878287,
        result: {
          gregorian: 'Wed Apr 10 2019',
          julian: 'Wed Mar 28 2019',
        },
      },
      {
        ts: 4102444799,
        result: {
          gregorian: 'Fri Jan 01 2100',
          julian: 'Fri Dec 19 2099',
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
});
