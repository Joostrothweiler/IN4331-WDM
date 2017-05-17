const test = require('blue-tape');

test('it works', t => {
  return Promise.resolve(true).then(t.ok, t.error);
})

// process.exit(0);
