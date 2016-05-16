var request = require('superagent');

module.exports = function() {
  Slack = function() {
    this.envs = {
      slack_webhook_url: process.env.SLACK_WEBHOOK_URL
    };
    
    this.message = {};
  };
  
  Slack.prototype.isMine = function() {
    return this.message.team_id && this.message.channel_id && this.message.user_id;
  };
  
  Slack.prototype.getText = function() {
    return this.message.text;
  };
  
  Slack.prototype.send = function(to, msg, resolve, reject) {
    me = this;
    request
      .post(me.envs.slack_webhook_url)
      .set('Content-type', 'application/json')
      .send({
        text: msg
      })
      .end(function(err, res) {
        if (res.ok) {
          return resolve(res.text);
        } else {
          return reject(err.response.error);
        }
      });
  };
  
  Slack.prototype.reply = function(msg) {
    me = this;
    return new Promise(function(resolve, reject) {
      me.send(null, "<@"+me.message.user_id+"> "+msg, resolve, reject);
    })
  };
    
  return Slack;
}();