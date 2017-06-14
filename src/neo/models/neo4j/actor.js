const _ = require('lodash');

const Actor = function (_node, simple = true) {
  _.extend(this, _node.properties);
  if (this.id) {
    this.id = this.id.toNumber(); // conver low/high to single integer
  }
  if(simple) {
    delete this.number;
    delete this.mname;
    delete this.id;
  }
};

module.exports = Actor;
