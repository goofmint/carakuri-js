var request   = require('superagent');
var Slack     = require('./libs/bots/slack');
var Messenger = require('./libs/bots/messenger');
var LINE      = require('./libs/bots/line');
var Twitter   = require('./libs/bots/twitter');
var Skype     = require('./libs/bots/skype');

module.exports = function() {
  var Carakuri = function(){
    this.envs = {
      token_url: process.env.CARAKURI_TOKEN
    };
    delete process.env['CARAKURI_TOKEN']
    
    this.message = {};
    this.data = {};
    this.bot = null;
  };
  
  Carakuri.Slack     = Slack;
  Carakuri.Messenger = Messenger;
  Carakuri.LINE      = LINE;
  Carakuri.Twitter   = Twitter;
  Carakuri.Skype     = Skype;
  
  var CHAT_TYPE = {
    SLACK: Carakuri.Slack,
    MESSENGER: Carakuri.Messenger,
    LINE: Carakuri.LINE,
    TWITTER: Carakuri.Twitter,
    SKYPE: Carakuri.Skype
  };

  Carakuri.prototype.setConfig = function() {
    return this;
  };
  
  Carakuri.prototype.setData = function(data) {
    this.data = data;
  };
  
  Carakuri.prototype.setMessage = function(message) {
    me = this;
    me.message = message;
    for (var bot_name in CHAT_TYPE) {
      var bot = new CHAT_TYPE[bot_name];
      bot.message = message;
      if (bot.isMine()) {
        this.bot = bot;
        break;
      }
    }
  };
    
  Carakuri.prototype.getText = function() {
    return this.bot.getText();
  };
  
  Carakuri.prototype.send = function(to, msg) {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.bot.send(to, msg, resolve, reject);
    });
  };
  
  Carakuri.prototype.reply = function(msg) {
    return this.bot.reply(msg);
  };
  
  Carakuri.prototype.save = function(data) {
    me = this;
    me.data = data;
    return new Promise(function(resolve, reject) {
      request.put(token_url)
        .send({data: me.data})
        .end(function(err, res) {
          if (res.ok) {
            resolve();
          }else{
            reject(err.response.error);
          }
        })
    });
  }
  var c = new Carakuri();
  return c.setConfig();
}();
