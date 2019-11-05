module.exports = function() {
  this.TiCu = {
    Log : require("./log.js")(),
    Send : require("./send.js"),
    Authorizations : require("./authorizations.js"),
    Mention : require("./mention.js"),
    Parser : require("./commands/parser.js"),
    Server : {
      AutoInvite : require("./server/autoinvite.js")
    },
    Commands : {
      prefixed : {
        send : require("./commands/prefixed/send.js")(),
        roles : require("./commands/prefixed/roles.js")()
      },
      auto : {
        dm : require("./commands/auto/dm.js"),
        quarantaine : require("./commands/auto/quarantaine.js")
      }

    }
  }
  global.TiCuDate = require("./ticudate.js")
}
