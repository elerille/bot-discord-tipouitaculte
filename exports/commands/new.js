module.exports = {
  alias: [
    "new"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id]
    },
    auths : {
      type: "whitelist",
      list: devTeam
    },
    roles : {
      type: "any"
    },
    name : "Nouveauté",
    desc : "Annoncer une nouvelle fonctionnalité",
    schema : "!new <command> (idMessageWhiteboard)"
  },
  run : function(params, msg) {
    if (params.length < 1) {
      TiCu.Log.Error("new", "mauvais paramètres", msg)
    } else {
      const botChannel = tipoui.channels.get(PUB.salons.bots.id)
      if (TiCu.Commands[params[0]] || TiCu.Auto[params[0]] || TiCu.Reactions[params[0]]) {
        botChannel.send(`Une nouvelle fonctionnalité est disponible pour TipouiTaCulte !`)
        if (params[1]) {
          tipoui.channels.get(PUB.salons.whiteboard.id).fetchMessage(params[1]).then(
            message => botChannel.send(`Cette fonctionnalité a été proposée à la communauté sous les termes suivants :\n"${message.embeds[0].description}"`)
          )
        }
        TiCu.Commands.help.run([params[0]], botChannel.lastMessage)
      } else {
        TiCu.Log.Error("new", "commande introuvable", msg)
      }
    }
  }
}
