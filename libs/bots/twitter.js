var twitter = require('twitter');

module.exports = function() {
  var envs = {};
  Twitter = function() {
    envs = {};
    this.message = {};
    this.client = new twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
    
    delete process.env['TWITTER_CONSUMER_KEY']
    delete process.env['TWITTER_CONSUMER_SECRET']
    delete process.env['TWITTER_ACCESS_TOKEN_KEY']
    delete process.env['TWITTER_ACCESS_TOKEN_SECRET']
  };
  
  Twitter.prototype.isMine = function() {
    return this.message.user && this.message.id_str && this.message.source && this.message.entities;
  }
  
  Twitter.prototype.getText = function() {
    return this.message.text;
  };
  
  Twitter.prototype.send = function(to, msg, resolve, reject) {
    this.client.post('statuses/update', {status: msg}, function(error, tweet, response){
      if (error) {
        reject(error);
      }else{
        resolve(tweet);
      }
    });
  };
  
  Twitter.prototype.reply = function(msg) {
    me = this;
    return new Promise(function(resolve, reject) {
      me.send(null, "@"+me.message.user.screen_name+" "+msg, resolve, reject);
    })
  };
  
  return Twitter;
}();

