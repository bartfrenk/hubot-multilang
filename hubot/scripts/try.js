// Description:
//   Example scripts for you to examine and try out.

// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.

fs = require("fs");
request = require("request");

const parser = DOMParser();

const insults = [];

function randomElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function readLines(fileName) {
  return fs
    .readFileSync(fileName, "utf-8")
    .split("\n")
    .filter(line => line !== "");
}

function extractInsult(page) {
  const doc = parser.parseFromString(page, "text/html");
}

function fetchInsultPage(cb) {
  request.get("https://www.wowbagger.com/process.php", function(
    error,
    response,
    body
  ) {
    insults.push(extractInsult(body));
  });
}

module.exports = function(robot) {
  robot.hear(/haa/, res => res.send(randomElement(insults)));
};
