module.exports = {
  alias: [
    "pin"
  ],
  activated: true,
  name : "Pin",
  desc : "Pin un message",
  schema : "!<pin> <#channel> <messageID>\nou\n!<pin> <messageURL>",
  authorizations : TiCu.Authorizations.getAuth("command", "pin"),
  run : function(params, msg) {
    let target
    if(params.length === 2) {
      target = TiCu.Messages.fetchMessageFromId(params[0], params[1], msg)
    } else if(params.length === 1) {
      target = TiCu.Messages.fetchMessageFromUrl(params[0], msg)
    } else return TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    if (target) {
      target.then(fetchedMsg => {
        fetchedMsg.pin()
          .then(_ => TiCu.Log.Commands.Pin(fetchedMsg, msg))
          .catch(error => console.log(error))
      })
        .catch(console.log)
    }
  }
}
