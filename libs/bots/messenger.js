var request = require('superagent');

module.exports = function() {

  Messenger = function() {
    this.envs = {};
    this.message = {};
  };
  Messenger.prototype.isMine = function() {
    return this.message.entry && Array.isArray(this.message.entry) && this.message.entry[0].messaging;
  }
  return Messenger;
}();

