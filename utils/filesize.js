module.exports = (size) => {
  const unit = ['b', 'kb', 'mb', 'gb'];
  let r = size;

  let i;
  for (i = 0; r >= 1024; i++) {
    r /= 1024;
  }

  return i === 0 ? false : r.toFixed(2) + unit[i];
};
