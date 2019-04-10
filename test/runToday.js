const should = require('chai').should();
const runToday = require('../src/runToday');
const {
  InterruptError,
} = require('../src/errors');

describe('runToday', () => {
  it('method为-h/--help抛出InterruptError', () => {
    const resultShort = () => { runToday('-h'); };
    const result = () => { runToday('--help'); };

    resultShort.should.throw(InterruptError);
    result.should.throw(InterruptError);
  });
});
