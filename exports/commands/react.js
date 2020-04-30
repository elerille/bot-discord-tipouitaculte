module.exports = {
  alias: [
    "react",
    "reaction"
  ],
  activated: true,
  name : "Reaction",
  desc : "Réagir à un message avec une émote.",
  schema : "!<react|reaction> <emoji> <#channel> <messageID>\nou\n!<react|reaction> <emoji> <messageURL>",
  authorizations : TiCu.Authorizations.getAuth("command", "react"),
  run : function(params, msg) {
    let emoji, target
    if(params.length === 3) {
      target = TiCu.Messages.fetchMessageFromId(params[1], params[2], msg)
    } else if(params.length === 2) {
      target = TiCu.Messages.fetchMessageFromUrl(params[1], msg)
    } else return TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    emoji = params[0]
    if (target) {
      target.then(fetchedMsg => {
        fetchedMsg.react(emoji)
          .then(_ => TiCu.Log.Commands.React(emoji, fetchedMsg, msg))
          .catch(anything => console.log(anything))
      })
        .catch(console.log)
    }
  }
}
