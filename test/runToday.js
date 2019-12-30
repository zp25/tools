const should = require('chai').should();
const sinon = require('sinon');
const rewire = require('rewire');
const { InterruptError } = require('../utils/errors');

const date = require('../src/cal');
const runToday = rewire('../src/runToday');

describe('runToday', () => {
  let revert = null;

  let spyDate = null;

  before(() => {
    spyDate = sinon.spy(date);

    revert = runToday.__set__({
      date: spyDate,
    });
  });

  afterEach(() => {
    spyDate.resetHistory();
  });

  after(() => {
    revert();
  });

  it('method为-h/--help抛出InterruptError', () => {
    const resultShort = () => { runToday('-h'); };
    const result = () => { runToday('--help'); };

    resultShort.should.throw(InterruptError);
    result.should.throw(InterruptError);
  });

  it('无options使用默认tz', () => {
    runToday();

    (spyDate.args[0][1] === undefined).should.be.true;
  });

  it('method为--gmt返回GMT日期', () => {
    runToday('--gmt');

    spyDate.args[0][1].should.equal('America/Danmarkshavn');
  });
});
