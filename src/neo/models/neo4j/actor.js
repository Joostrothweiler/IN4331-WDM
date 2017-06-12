const _ = require('lodash');

const Actor = function (_node) {
  _.extend(this, _node.properties);
  if (this.id) {
    this.id = this.id.toNumber(); // conver low/high to single integer
  }
};

module.exports = Actor;
