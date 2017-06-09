const _ = require('lodash');

const Actor = function (_node) {
  _.extend(this, _node.properties);
  if (this.id) {
  	this.id = Number(this.id); // convert string to integer.
  }
};

module.exports = Actor;
