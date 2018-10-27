// Description:
//   Example scripts for you to examine and try out.

// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.

fs = require("fs");
request = require("request");
parser = require("node-html-parser");



// Make this generic and rename to something like AutoList
// Or make it a precaching stream
class InsultList {
  // Keep the list at the same size, and move the cursor up.
  constructor(insults, maxBackups) {
    this.insults = [];
    this.backups = insults;
    this.maxBackups = maxBackups;
  }

  getInsult() {
    if (this.insults.length === 0) {
      return randomElement(this.backups);
    }

    insult = this.insults.pop();
    fetchInsult(insult => this.insults.push(insult));
    this.addToBackups(insult);
    return insult;
  }

  addToBackups(insult) {
    this.backups.push(insult);
    if (this.backups.length > this.maxBackups) {
      this.backups.pop()
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

insults = InsultList([], 100);

module.exports = function(robot) {
  robot.hear(/haa/, res => {
    res.send(randomElement(insultList));
    fetchInsult(insult => insultList.push(insult));
  });
};
