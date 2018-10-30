// Description:
//   Example scripts for you to examine and try out.

// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.

fs = require("fs");
request = require("request");
parser = require("node-html-parser");

// TODO: Take rate limiting of sourceAsync into account
class PrefetchedStream {
  constructor(sourceAsync, seed = [], maxBackups) {
    this.sourceAsync = sourceAsync;
    this.prefetched = seed;
    this.backups = [];
    this.maxBackups = maxBackups || 20;
  }

  next() {
    if (this.prefetched.length === 0) {
      return randomElement(this.backups);
    }

    const elt = this.prefetched.pop();
    this.sourceAsync(elt => this.prefetched.push(elt));
    this.addToBackups(elt);
    return elt;
  }

  addToBackups(elt) {
    this.backups.push(elt);
    if (this.backups.length > this.maxBackups) {
      this.elt.pop();
    }
  }
}

function randomElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function extractInsult(page) {
  const root = parser.parse(page);
  return root.querySelector(".customBig").structuredText;
}

function fetchInsult(cb) {
  request.get("https://www.wowbagger.com/process.php", function(
    error,
    response,
    body
  ) {
    cb(extractInsult(body));
  });
}

const insults = new PrefetchedStream(fetchInsult, ["Hi!", "hello"], 100);

module.exports = function(robot) {
  robot.hear(/debug/, res => {
    res.send(`backups: ${insults.backups} prefetched: ${insults.prefetched}`);
  });
  robot.hear(/haa/, res => {
    res.send(insults.next());
  });
};
