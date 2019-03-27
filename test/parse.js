const should = require('chai').should();
const {
  interrupt,
  getConfig,
  findOptionDescription,
} = require('../src/parse');
const { InvalidOptionError } = require('../src/errors');

const optsMap = {
  foo: '-f',
  bar: ['-b', '--bar'],
  quz: '-q',
  empty: '',
};

describe('interrupt', () => {
  it('参数-h/--help返回true，否则返回false', () => {
    interrupt('-h').should.be.true;
    interrupt('--help').should.be.true;

    interrupt('others').should.be.false;
  });
});

describe('findOptionDescription', () => {
  it('若合法选项，返回选项的描述', () => {
    findOptionDescription(optsMap, '-f').should.equal('foo');
    findOptionDescription(optsMap, '-b').should.equal('bar');
    findOptionDescription(optsMap, '--bar').should.equal('bar');
    findOptionDescription(optsMap, '-q').should.equal('quz');
  });

  it('若无对应选项，返回undefined', () => {
    (findOptionDescription(optsMap, '-u') === undefined).should.be.true;
    (findOptionDescription(optsMap, '--undefined') === undefined).should.be.true;
  });
});

describe('getConfig', () => {
  it('不传参数返回空对象', () => {
    getConfig().should.eql({});
  });

  it('-或--起始作为配置的选项，紧跟的=后方内容为选项的值，或无紧跟内容时值为true', () => {
    const input = [
      '-f=foo',
      '--bar=bar',
      '-q',
    ];

    const result = {
      foo: 'foo',
      bar: 'bar',
      quz: true,
    };

    getConfig(optsMap, input).should.eql(result);
  });

  it('若选项查找表没有匹配项，抛出InvalidOptionError', () => {
    const input = ['-u'];
    const result = () => { getConfig(optsMap, input); };

    result.should.throw(InvalidOptionError);
  });

  it('若查询表有空字符串选项，允许将不以-或--起始的内容匹配到对应选项描述符，并总以数组记录', () => {
    const input = ['empty'];
    const result = {
      empty: ['empty'],
    };

    getConfig(optsMap, input).should.eql(result);
  });

  it('若有多个不以-或--起始的内容，以数组记录所有，有先后顺序', () => {
    const input = ['empty1', 'empty2', 'empty3'];
    const result = {
      empty: ['empty1', 'empty2', 'empty3'],
    };

    getConfig(optsMap, input).should.eql(result);
  });

  it('input也可接收string', () => {
    const input = 'empty';
    const result = {
      empty: ['empty'],
    };

    getConfig(optsMap, input).should.eql(result);
  });
});
