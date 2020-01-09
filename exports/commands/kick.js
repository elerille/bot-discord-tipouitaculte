module.exports = {
  alias: [
    "kick"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.botsecret.id]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
  },
    name : "Kick",
    desc : "Expulser eun membre du serveur.",
    schema : "!kick <@> (raison)",
    channels : "🐙interface-tipoui",
    authors : "Toustes",
    roleNames : "Tous"
  },
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
