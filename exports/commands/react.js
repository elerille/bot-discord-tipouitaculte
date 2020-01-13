module.exports = {
  alias: [
    "react",
    "reaction"
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
    name : "Reaction",
    desc : "Réagir à un message avec une émote.",
    schema : "!<react|reaction> <emoji> <#channel> <messageID>\nou\n!<react|reaction <emoji> <messageURL>",
    channels : "🐙interface-tipoui",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    // https://discordapp.com/channels/server/channel/message
    let emoji, url, server, chan, target, message
    if(params.length === 3) {
      server = tipoui
      chan = TiCu.Mention(params[1])
      if(chan) {
        target = chan.fetchMessage(params[2])
      } else {
        return TiCu.Log.Error("react", "salon introuvable", msg)
      }
    } else if(params.length === 2) {
      url = params[1].split("/")
      server = Discord.guilds.get(url[4])
      if(server) {
        chan = server.channels.get(url[5])
        if(chan) {
          target = chan.fetchMessage(url[6])
        } else return TiCu.Log.Error("react", "salon introuvable", msg)
      } else return TiCu.Log.Error("react", "serveur introuvable", msg)
    } else return TiCu.Log.Error("react", "paramètres invalides", msg)
    emoji = params[0]
    target.then(fetchedMsg => {
      fetchedMsg.react(params[0])
        .then(TiCu.Log.Commands.React(params[0], fetchedMsg, msg))
        .catch(anything => console.log(anything))
      })
      .catch(console.log)
      // TiCu.Log.Error("react", "impossible d'ajouter cette réaction", msg)
  }
}
