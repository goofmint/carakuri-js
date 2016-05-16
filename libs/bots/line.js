var request = require('superagent');

module.exports = function() {
  LINE = function() {
    this.envs = {};
    this.message = {};
  };
  
  LINE.prototype.isMine = function() {
    return false;
  };
  
  return LINE;
}();
