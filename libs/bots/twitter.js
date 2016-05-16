var request = require('superagent');

module.exports = function() {

  Twitter = function() {
    this.envs = {};
    this.message = {};
  };
  
  Twitter.prototype.isMine = function() {
    return false;
  }
  return Twitter;
}();

