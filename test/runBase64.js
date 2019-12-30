const should = require('chai').should();
const sinon = require('sinon');
const rewire = require('rewire');
const {
  InvalidMethodError,
  InvalidOptionError,
  InterruptError,
} = require('../utils/errors');

const runBase64 = rewire('../src/runBase64');

describe('runBase64', () => {
  let revert = null;

  let spyEncode = null;
  let spyDecode = null;

  before(() => {
    spyEncode = sinon.spy();
    spyDecode = sinon.spy();

    revert = runBase64.__set__({
      encodeBase64: spyEncode,
      decodeBase64: spyDecode,
    });
  });

  afterEach(() => {
    spyEncode.resetHistory();
    spyDecode.resetHistory();
  });

  after(() => {
    revert();
  });

  it('method空或为-h/--help抛出InterruptError', () => {
    const resultEmpty = () => { runBase64(); };
    const resultShort = () => { runBase64('-h'); };
    const result = () => { runBase64('--help'); };

    resultEmpty.should.throw(InterruptError);
    resultShort.should.throw(InterruptError);
    result.should.throw(InterruptError);
  });

  it('method非encode/decode抛出InvalidMethodError', () => {
    const result = () => { runBase64('error'); };

    result.should.throw(InvalidMethodError);
  });

  it('text空抛出InvalidOptionError', () => {
    const encodeResult = () => { runBase64('encode'); };
    const decodeResult = () => { runBase64('decode'); };

    encodeResult.should.throw(InvalidOptionError);
    decodeResult.should.throw(InvalidOptionError);
  });

  it('多条text仅第一条为有效输入, 能设置默认编码utf8', () => {
    runBase64('encode', ['foo', 'bar', 'baz']);
    runBase64('decode', ['bar', 'baz', 'quz']);

    spyEncode.calledOnceWithExactly('foo', 'utf8').should.be.true;
    spyDecode.calledOnceWithExactly('bar', 'utf8').should.be.true;
  });

  it('可通过--encoding自定义编码方式', () => {
    runBase64('encode', ['--encoding=encodefoo', 'foo']);
    runBase64('decode', ['--encoding=encodebar', 'bar']);

    spyEncode.calledOnceWithExactly('foo', 'encodefoo').should.be.true;
    spyDecode.calledOnceWithExactly('bar', 'encodebar').should.be.true;
  });

  it('config可直接传入字符串作为text', () => {
    runBase64('encode', 'foo');
    runBase64('decode', 'bar');

    spyEncode.calledOnceWith('foo').should.be.true;
    spyDecode.calledOnceWith('bar').should.be.true;
  });
});
