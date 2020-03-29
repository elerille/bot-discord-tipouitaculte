module.exports = {
  alias: [
    "xpstatus",
    "xpstatut"
  ],
  activated: true,
  name : "XPstatut",
  desc : "Afficher un statut, ou modifier le votre, ou, dans l'Interface Tipoui, modifier celui d'eun autre membre, par rapport au système d'XP.",
  schema : "Pour toustes : !xpstatus ( ( (inclure|exclure) | @ )\nVigilant·es : !xpstatus <inclure|exclure> <@>",
  authorizations : TiCu.Authorizations.getAuth("command", "xpstatus"),
  run : function(params, msg) {
    switch (params.length) {
      case 1:
        if (params[0] === "inclure" || params[0] === "exclure") {
          TiCu.Xp.changeMemberStatus(msg.author.id, params[0] === "inclure", msg)
        } else {
          const target = params[0] ? TiCu.Mention(params[0]).id : null
          TiCu.Xp.getMember(target).then(
            entry => {
              if (entry) {
                msg.channel.send(`Le compte de ${TiCu.Mention(params[0]).displayName} est ${entry.activated ? "activé" : "désactivé"} dans le système`)
              } else {
                TiCu.Log.Error("XPStatut", "cible introuvable ou erreur de base de donnée", msg)
              }
            }
          )
        }
        break;
      case 2:
        if (msg.channel.id === PUB.salons.botsecret.id || msg.channel.guild.id === PUB.servers.vigi.id) {
          const memberParam = params[1] ? TiCu.Mention(params[1]) : null
          const target = memberParam ? memberParam.id : msg.author.id
          TiCu.Xp.changeMemberStatus(target, params[0] === "inclure", msg)
        } else {
          TiCu.Log.Error("XPStatut", "seules les Vigilant·es peuvent modifier le statut d'eun autre membre", msg)
        }
        break;
      default:
        TiCu.Xp.getMember(msg.author.id).then(
          entry => {
            if (entry) {
              msg.channel.send(`Votre compte est ${entry.activated ? "activé" : "désactivé"} dans le système`)
            } else {
              TiCu.Log.Error("XPStatut", "cible introuvable ou erreur de base de donnée", msg)
            }
          }
        )
    }
  }
}
