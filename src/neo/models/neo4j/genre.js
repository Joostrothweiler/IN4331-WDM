const _ = require('lodash');

const Genre = (_node) => {
  _.extend(this, _node.properties);
  if (this.id) {
  	this.id = this.id.toNumber();
  }
};

module.exports = Genre;
