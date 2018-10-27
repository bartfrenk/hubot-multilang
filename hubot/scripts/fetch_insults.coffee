# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#
#   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

fs = require 'fs'

module.exports = (robot) ->
  robot.hear /bla/i, (res) ->
    fileName = 'test.txt'
    contents = (fs.readFileSync fileName, 'utf8').split "\n"
    res.send contents[0]
