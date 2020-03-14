module.exports = {
  alias: [
    "unpin"
  ],
  activated: true,
  name : "Unpin",
  desc : "Unpin un message",
  schema : "!<pin> <#channel> <messageID>\nou\n!<pin> <messageURL>",
  authorizations : TiCu.Authorizations.getAuth("command", "react"),
  run : function(params, msg) {
    let target
    if(params.length === 2) {
      target = TiCu.Messages.fetchMessageFromId(params[0], params[1], msg)
    } else if(params.length === 1) {
      target = TiCu.Messages.fetchMessageFromUrl(params[0], msg)
    } else return TiCu.Log.Error("pin", "paramètres invalides", msg)
    if (target) {
      target.then(fetchedMsg => {
        fetchedMsg.unpin()
          .then(_ => TiCu.Log.Commands.Unpin(fetchedMsg, msg))
          .catch(error => console.log(error))
      })
        .catch(console.log)
    }
  }
}