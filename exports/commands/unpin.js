module.exports = {
  alias: [
    "unpin"
  ],
  activated: true,
  name : "Unpin",
  desc : "Unpin un message",
  schema : "!<unpin> <#channel> <messageID>\nou\n!<unpin> <messageURL>",
  authorizations : TiCu.Authorizations.getAuth("command", "unpin"),
  run : function(params, msg) {
    let target
    if(params.length === 2) {
      target = TiCu.Messages.fetchMessageFromId(params[0], params[1], msg)
    } else if(params.length === 1) {
      target = TiCu.Messages.fetchMessageFromUrl(params[0], msg)
    } else return TiCu.Log.Error("unpin", "paramètres invalides", msg)
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