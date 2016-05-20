var request = require('superagent');

module.exports = function() {
  var envs = {};
  
  Messenger = function() {
    envs = {
      fbpage_token: process.env.FBPAGE_TOKEN
    };
    delete process.env['FBPAGE_TOKEN']
    
    this.message = {};
  };
  
  Messenger.prototype.isMine = function() {
    return this.message.message && this.message.message.text && this.message.sender && this.message.sender.id
  }

  Messenger.prototype.getText = function() {
    return this.message.text;
  };
  
  Messenger.prototype.send = function(to, msg, resolve, reject) {
    console.log(to)
    request
      .post('https://graph.facebook.com/v2.6/me/messages')
      .query({access_token: envs.fbpage_token})
      .send({
          recipient: {id: to},
          message: msg
      })
      .end(function(err, res){
          if (err || !res.ok) {
            reject(err);
          } else {
            resolve(res);
          }
      });
  };
  
  Messenger.prototype.reply = function(msg) {
    me = this;
    return new Promise(function(resolve, reject) {
      me.send(me.message.sender.id, {text: msg}, resolve, reject);
    })
  };
  
  return Messenger;
}();

