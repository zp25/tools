const should = require('chai').should();
const sinon = require('sinon');
const rewire = require('rewire');

const imagemin = rewire('../src/imagemin');

const { webp, compress } = imagemin;

describe('imagemin', () => {
  let revert = null;

  let spy = null;
  let spyWebp = null;
  let spyMoz = null;
  let spyPngquant = null;
  let spyOptipng = null;

  before(() => {
    spy = sinon.spy();
    spyWebp = sinon.spy();
    spyMoz = sinon.spy();
    spyPngquant = sinon.spy();
    spyOptipng = sinon.spy();

    revert = imagemin.__set__({
      imagemin: spy,
      imageminWebp: spyWebp,
      imageminMozjpeg: spyMoz,
      imageminOptipng: spyOptipng,
      imageminPngquant: spyPngquant,
    });
  });

  afterEach(() => {
    spy.resetHistory();
    spyWebp.resetHistory();
    spyMoz.resetHistory();
    spyPngquant.resetHistory();
    spyOptipng.resetHistory();
  });

  after(() => {
    revert();
  });

  it('input可接收string或string[]，使用时总是转化为数组', () => {
    webp('webp');
    webp(['webp[]']);

    compress('compress');
    compress(['compress[]']);

    const result = [
      spy.firstCall.calledWith(['webp']),
      spy.secondCall.calledWith(['webp[]']),
      spy.thirdCall.calledWith(['compress']),
      spy.lastCall.calledWith(['compress[]']),
    ];

    result.should.eql([true, true, true, true]);
  });

  it('webp可配置quality', () => {
    const quality = 'quality';

    webp(undefined, undefined, { quality });

    spyWebp.calledOnceWith(sinon.match({ quality })).should.be.true;
  });

  it('mozjpeg可配置quality', () => {
    const quality = 'quality';

    compress(undefined, undefined, { quality });

    spyMoz.calledOnceWith(sinon.match({ quality })).should.be.true;
  });

  it('compress默认使用pngquant', () => {
    compress();

    const result = [
      spyPngquant.calledOnce,
      spyOptipng.notCalled,
    ];

    result.should.eql([true, true]);
  });

  it('compress可配置使用optipng', () => {
    compress(undefined, undefined, { optipng: true });

    const result = [
      spyPngquant.notCalled,
      spyOptipng.calledOnce,
    ];

    result.should.eql([true, true]);
  });
});
