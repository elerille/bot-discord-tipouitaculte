module.exports = {
  alias: [
    "kick"
  ],
  activated: true,
  name : "Kick",
  desc : "Expulser eun membre du serveur.",
  schema : "!kick <@> (raison)",
  authorizations : TiCu.Authorizations.getAuth("command", "kick"),
  run : function(params, msg) {
    let crop = new RegExp(/^(!kick\s+[^\s]+\s+)/)
    let target
    if(TiCu.Mention(params[0])) {target = TiCu.Mention(params[0])} else return TiCu.Log.Error("kick", "cible invalide", msg)
    let reason = !!params[1]
    if(reason) {reason = msg.content.substring(msg.content.match(crop)[1].length)}
    msg.reply(`voulez-vous expulser <@${target.id}> du serveur ?`)
      .then(newMsg => {
        newMsg
        .react("👍")
        .then(() => newMsg.react("👎"))
        .then(() => {
          let filter = (reaction, user) => {return (user.id === msg.author.id)}
          newMsg
            .awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
            .then(collected => {
              const reaction = collected.firstKey();
              if (reaction === "👍") {
                reason ? target.kick(reason) : target.kick()
                const jsonActionData = {action : "read", target : KickedFile}
                const kickedData = TiCu.json(jsonActionData)
                if (kickedData) {
                  kickedData.list.push(target.id)
                  jsonActionData.action = "write"
                  jsonActionData.content = kickedData
                  TiCu.json(jsonActionData)
                }
                TiCu.Log.Commands.Kick(target, reason, msg)
              } else {
                return TiCu.Log.Error("kick", "annulation", msg)
              }
            })
            .catch(collected => {
              if (!collected) Event.emit("cancelAwait", "kick", target)
            })
        })
      })
  }
}
