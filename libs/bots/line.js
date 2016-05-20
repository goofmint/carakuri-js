var request = require('superagent');

module.exports = function() {
  var envs = {};
  LINE = function() {
    envs = {
      line_channel_id: process.env.LINE_CHANNEL_ID,
      line_channel_secret: process.env.LINE_CHANNEL_SECRET,
      line_mid: process.env.LINE_MID
    };
    
    delete process.env['LINE_CHANNEL_ID']
    delete process.env['LINE_CHANNEL_SECRET']
    delete process.env['LINE_MID']
    this.message = {};
  };
  
  LINE.prototype.isMine = function() {
    return this.message.content && this.message.content.contentMetadata && this.message.eventType && this.message.fromChannel;
  };
  
  LINE.prototype.getText = function() {
    return this.message.content.text;
  };
  
  LINE.prototype.send = function(to, msg, resolve, reject) {
    me = this;
    request
      .post("https://trialbot-api.line.me/v1/events")
      .set("Content-type", "application/json; charset=UTF-8")
      .set("X-Line-ChannelID", envs.line_channel_id)
      .set("X-Line-ChannelSecret", envs.line_channel_secret)
      .set("X-Line-Trusted-User-With-ACL", envs.line_mid)
      .send({
          "to":[to],
          "toChannel": "1383378250",
          "eventType": "138311608800106203", // data.eventType,
          "content": msg
      })
      .end(function(err, res){
          if (err || !res.ok) {
            return reject(err.response.error);
          } else {
            return resolve(res);
          }
      });
  };
  
  LINE.prototype.reply = function(msg) {
    me = this;
    var content = me.message.content;
    content.text = msg;
    return new Promise(function(resolve, reject) {
      me.send(me.message.content.from, content, resolve, reject);
    });
  };
  
  return LINE;
}();
