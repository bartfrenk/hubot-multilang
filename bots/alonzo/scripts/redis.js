// Dependencies:
//   "node_redis": "^2.8.0"

const redis = require("redis");
const hello = require("../src/hello.js");

class TrelloProxy {
  constructor(trelloKey, trelloToken) {
    this.trelloKey = trelloKey;
    this.trelloToken = trelloToken;
  }
}

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

module.exports = function(robot) {
  robot.respond(/set ([^=]+)=(.+)/, msg => {
    redisClient.set(msg.match[1], msg.match[2]);
    msg.reply(`Set ${msg.match[1]} = ${msg.match[2]}`);
  });

  robot.respond(/get ([^=]+)/, msg => {
    const key = msg.match[1];
    redisClient.get(key, (err, reply) => {
      msg.reply(`${key}=${reply && reply.toString()}`);
    });
  });

  robot.hear(/hh/, msg => {
    msg.reply(hello(1));
  });
};
