const randomMessageId = "660614530111635476"

module.exports = {
  alias: [
    "new"
  ],
  activated: true,
  name : "Nouveauté",
  desc : "Annoncer une nouvelle fonctionnalité",
  schema : "!new <command> (idMessageWhiteboard)",
  authorizations : TiCu.Authorizations.getAuth("command", "new"),
  run : function(params, msg) {
    if (params.length < 1) {
      TiCu.Log.Error("new", "mauvais paramètres", msg)
    } else {
      const botChannel = tipoui.channels.resolve(PUB.salons.bots.id)
      if (TiCu.Commands[params[0]] || TiCu.Auto[params[0]] || TiCu.Reactions[params[0]]) {
        botChannel.send(`Une nouvelle fonctionnalité est disponible pour TipouiTaCulte !`)
        if (params[1]) {
          tipoui.channels.resolve(PUB.salons.whiteboard.id).messages.fetch(params[1]).then(
            message => botChannel.send(`Cette fonctionnalité a été proposée à la communauté sous les termes suivants :\n"${message.embeds[0].description}"`)
          )
        }
        botChannel.messages.fetch(randomMessageId).then(randomMsg => {
          TiCu.Commands.help.run([params[0]], randomMsg)
        })
      } else {
        TiCu.Log.Error("new", "commande introuvable", msg)
      }
    }
  }
}
