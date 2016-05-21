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
  
  function pickup_random_stamp(type, pkg_id) {
    var stickers = [
      {id: "1", pkg_id: "1", alter: ["zzz", "sleep"]},
      {id: "2", pkg_id: "1", alter: ["smiling", "fine", "smile"]},
      {id: "3", pkg_id: "1", alter: ["oh", "really?", "shock"]},
      {id: "4", pkg_id: "1", alter: ["please","yes", "give me"]},
      {id: "5", pkg_id: "1", alter: ["fine", "happy", "love", "delight"]},
      {id: "6", pkg_id: "1", alter: ["rage", "red", "angry"]},
      {id: "7", pkg_id: "1", alter: ["iknow", "finger", "you"]},
      {id: "8", pkg_id: "1", alter: ["afraid", "really?", "awful", "really"]},
      {id: "9", pkg_id: "1", alter: ["rain", "cry", "sad"]},
      {id: "10", pkg_id: "1", alter: ["evil", "grinning", "grin"]},
      {id: "11", pkg_id: "1", alter: ["song", "music", "sing"]},
      {id: "12", pkg_id: "1", alter: ["challenge", "fight", "hustle"]},
      {id: "13", pkg_id: "1", alter: ["good job", "thumb up", "good"]},
      {id: "14", pkg_id: "1", alter: ["great job", "thumb up", "glad", "congrats"]},
      {id: "15", pkg_id: "1", alter: ["cheating", "smile", "smiling", "cheat"]},
      {id: "16", pkg_id: "1", alter: ["crying", "sad", "cry"]},
      {id: "17", pkg_id: "1", alter: ["bloodthirstiness", "hint", "fear"]},
      {id: "21", pkg_id: "1", alter: ["hangover", "spit", "vomit", "disgorge"]},
      {id: "100", pkg_id: "1", alter: ["laugh", "laughing"]},
      {id: "101", pkg_id: "1", alter: ["thinking", "displeasure", "pout", "bad mood"]}
    ];
    var base = {
      contentType: 8,
      toType: 1
    };
    
    alters = [];
    for (key in stickers) {
      var sticker = stickers[key];
      if (typeof pkg_id != 'undefined') {
        if (sticker.pkg_id != pkg_id) {
          continue;
        }
      }
      if (sticker.alter.indexOf(type) > -1) {
        alters.push(sticker);
      }
    }
    if (alters.length == 0) {
      return null;
    }
    var sticker = alters[Math.floor(Math.random() * alters.length)];
    base.contentMetadata = {
      STKID: sticker.id,
      STKPKGID: sticker.pkg_id,
      STKVER: (sticker.version || "100")
    }
    return base;
  }
  
  LINE.prototype.reply_stamp = function(type, pkg_id) {
    me = this;
    return new Promise(function(resolve, reject) {
      msg = pickup_random_stamp(type, pkg_id);
      if (msg == null) {
        reject("No stamp found. ("+type+")");
      }else{
        me.send(me.message.content.from, msg, resolve, reject);
      }
    });
  },
  
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
