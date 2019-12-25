module.exports = {
  alias: [
    'ban'
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
    name : "Ban",
    desc : "Bannir eun membre du serveur.",
    schema : "!ban <@> (raison)",
    channels : "Bots Vigilant·es",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    let crop = new RegExp(/^(!ban\s+[^\s]+\s+)/)
    let target
    if(TiCu.Mention(params[0])) {target = TiCu.Mention(params[0])} else return TiCu.Log.Error("ban", "cible invalide", msg)
    let reason = !!params[1]
    if(reason) {reason = msg.content.substring(msg.content.match(crop)[1].length)}
    msg.reply("voulez-vous bannir <@" + target.id + "> du serveur ?")
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
                reason ? target.ban(reason) : target.ban()
                TiCu.Log.Commands.Ban(target, reason, msg)
              } else {
                return TiCu.Log.Error("ban", "annulation", msg)
              }
            })
            .catch(collected => {
              if (!collected) Event.emit("cancelAwait", "ban", target)
            })
        })
      })
  }
}
