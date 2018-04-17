const should = require('chai').should();
const sinon = require('sinon');
const rewire = require('rewire');
const imagemin = rewire('../imagemin');

const { webp, compress } = imagemin;

describe('imagemin', () => {
  let spy = null;
  let revert = null;

  before(() => {
    spy = sinon.spy();

    revert = imagemin.__set__({
      imagemin: spy,
      imageminWebp: () => 'webp',
      imageminMozjpeg: () => 'mozjpeg',
      imageminOptipng: () => 'optipng',
      imageminPngquant: () => 'pngquant',
      imageminSvgo: () => 'svgo',
    });
  });

  afterEach(() => {
    spy.resetHistory();
  });

  after(() => {
    revert();
  });

  it('webp, compress都调用imagemin模块', () => {
    webp();
    compress();

    spy.calledTwice.should.be.true;
  });

  it('webp使用imagemin-webp', () => {
    webp();

    const { plugins } = spy.args[0][2];

    plugins.should.eql(['webp']);
  });

  it('compress默认使用imagemin-mozjpeg, imagemin-pngquant, imagemin-svgo', () => {
    compress();

    const { plugins } = spy.args[0][2];

    plugins.length.should.equal(3);

    plugins.should.include('mozjpeg');
    plugins.should.include('pngquant');
    plugins.should.include('svgo');
  });

  it('compress第二个参数传入true可使用imagemin-optipng', () => {
    compress(undefined, true);

    const { plugins } = spy.args[0][2];

    plugins.length.should.equal(3);

    plugins.should.include('mozjpeg');
    plugins.should.include('optipng');
    plugins.should.include('svgo');
  });
});
