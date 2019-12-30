const should = require('chai').should();
const { InvalidOptionError, InterruptError } = require('../utils/errors');

const runZxcvbn = require('../src/runZxcvbn');

describe('runZxcvbn', () => {
  it('参数为空数组或第一项为-h/--help抛出InterruptError', () => {
    const resultEmpty = () => { runZxcvbn([]); };
    const resultShort = () => { runZxcvbn(['-h']); };
    const result = () => { runZxcvbn(['--help']); };
    const resultExtra = () => { runZxcvbn(['--help', 'abc']); };

    resultEmpty.should.throw(InterruptError);
    resultShort.should.throw(InterruptError);
    result.should.throw(InterruptError);
    resultExtra.should.throw(InterruptError);
  });

  it('无password抛出InvalidOptionError', () => {
    const result = () => { runZxcvbn(['-v']); };

    result.should.throw(InvalidOptionError);
  });
});
