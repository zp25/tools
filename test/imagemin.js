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
    });
  });

  after(() => {
    revert();
  });

  it('webp, compress都调用imagemin模块', () => {
    webp();
    compress();

    spy.calledTwice.should.be.true;
  });
});
