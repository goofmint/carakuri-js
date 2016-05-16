var request = require('superagent');

module.exports = function() {
  Skype = function() {
    this.envs = {};
    this.message = {};
  };

  Skype.prototype.isMine = function() {
    return false;
  }
  return Skype;
}();

