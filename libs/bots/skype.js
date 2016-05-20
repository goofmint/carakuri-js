var request = require('superagent');
skype = require('skype-sdk');
module.exports = function() {
  var envs = {};
  Skype = function() {
    envs = {
      botId: process.env.SKYPE_BOT_ID,
      appId: process.env.SKYPE_APP_ID,
      appSecret: process.env.SKYPE_APP_SECRET
    };
    delete process.env['SKYPE_BOT_ID']
    delete process.env['SKYPE_APP_ID']
    delete process.env['SKYPE_APP_SECRET']
    
    this.message = {};
  };

  Skype.prototype.isMine = function() {
    return this.message._json && this.message.action && this.message._json[0].content
  }

  Skype.prototype.getText = function() {
    return this._json.message.content;
  };
  
  Skype.prototype.send = function(to, msg, resolve, reject) {
    me = this;
    botService = new skype.BotService({
        messaging: {
            botId: envs.botId,
            serverUrl : "https://apis.skype.com",
            requestTimeout : 15000,
            appId: envs.appId,
            appSecret: envs.appSecret
        }
    });
    botService.messagingBotService.send(to, msg, true, function(err){
      if (err) {
        reject(err);
      }else{
        resolve(null);
      }
    });
  };
  
  Skype.prototype.reply = function(msg) {
    me = this;
    var to = (me.message._json[0].to == envs.SKYPE_BOT_ID) ? me.message._json[0].from : me.message._json[0].to;
    return new Promise(function(resolve, reject) {
      me.send(to, msg, resolve, reject);
    })
  };
  
  return Skype;
}();

