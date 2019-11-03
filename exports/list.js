module.exports = function() {
  this.TiCu = {
    Error : require("./error.js")(),
    Log : require("./log.js")(),
    Send : require("./send.js"),
    Authorizations : require("./authorizations.js"),
    Mention : require("./mention.js")
    Parser : require("./commands/parser.js"),
    Server : {
      AutoInvite : require("./server/autoinvite.js")
    },
    Commands : {
      Prefixed : {
        send : require("./commands/prefixed/send.js")
      }
    }
  }
  global.TiCuDate = require("./ticudate.js")
}
