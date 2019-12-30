const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const rewire = require('rewire');
const {
  InvalidMethodError,
  InvalidOptionError,
  InterruptError,
} = require('../utils/errors');

chai.use(chaiAsPromised);
const should = chai.should();

const runImagemin = rewire('../src/runImagemin');

describe('runImagemin', () => {
  let revert = null;

  let spyWebp = null;
  let spyCompress = null;
  let stubInfo = null;

  before(() => {
    spyWebp = sinon.spy();
    spyCompress = sinon.spy();

    stubInfo = sinon.stub();
    stubInfo.returns([]);

    revert = runImagemin.__set__({
      webp: spyWebp,
      compress: spyCompress,
      info: stubInfo,
    });
  });

  afterEach(() => {
    spyWebp.resetHistory();
    spyCompress.resetHistory();
  });

  after(() => {
    revert();
  });

  it('method空抛出InvalidMethodError', () => {
    runImagemin().should.be.rejectedWith(InvalidMethodError);
  });

  it('method为-h/--help抛出InterruptError', () => {
    runImagemin('-h').should.be.rejectedWith(InterruptError);
    runImagemin('--help').should.be.rejectedWith(InterruptError);
  });

  it('method非webp/compress抛出InvalidMethodError', () => {
    runImagemin('error').should.be.rejectedWith(InvalidMethodError);
  });

  it('config可以为空，会设置多个默认值', async () => {
    const input = './input/*.{jpg,jpeg,png,svg}';
    const output = './output';
    const quality = '75';
    const optipng = false;

    await runImagemin('webp');
    spyWebp.calledOnceWith(input, output, sinon.match({ quality })).should.be.true;

    await runImagemin('compress');
    spyCompress.calledOnceWith(input, output, sinon.match({
      quality,
      optipng,
    })).should.be.true;
  });

  it('可通过--input, --output, --quality, --optipng自定义配置', async () => {
    const input = './in/*.{jpg,jpeg,png,svg}';
    const output = './out';
    const quality = '60';
    const optipng = true;

    const config = [
      '--input=./in',
      `--output=${output}`,
      `--quality=${quality}`,
      '--optipng',
    ];

    await runImagemin('webp', config.slice(0, 3));
    spyWebp.calledOnceWith(input, output, sinon.match({ quality })).should.be.true;

    await runImagemin('compress', config);
    spyCompress.calledOnceWith(input, output, sinon.match({
      quality,
      optipng,
    })).should.be.true;
  });

  it('config可接收string，作为一项自定义配置', async () => {
    const input = './in/*.{jpg,jpeg,png,svg}';

    await runImagemin('webp', '--input=./in');
    spyWebp.calledOnceWith(input).should.be.true;

    await runImagemin('compress', '--input=./in');
    spyCompress.calledOnceWith(input).should.be.true;
  });
});
