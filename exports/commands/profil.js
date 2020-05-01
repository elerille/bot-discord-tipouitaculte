module.exports = {
  alias: [
    "profil"
  ],
  activated: true,
  name : "Profil",
  desc : "Afficher le profil d'eun membre ou modifier son propre profil.",
  schema : "!profil (@)\nou\n!profil <set> <avatar|titre|citation|champ> <valeur>\nou\n!profil <delete|get> <champ>",
  authorizations : TiCu.Authorizations.getAuth("command", "profil"),
  run : function(params, msg, rawParams) {
    if (params[0]) {
      switch (params[0]) {
        case "set":
          if (params.length >= 3 || (params.length >= 2 && (params[1] === "avatar" || params[1] === "vava") && !!msg.attachments.first())) {
            rawParams.shift()
            let fieldName = rawParams.shift()
            let fieldValue = ""
            for (const rawParam of rawParams) {
              fieldValue += (rawParam + " ")
            }
            TiCu.Profil.setValue(fieldName, fieldValue.substr(0, fieldValue.length-1), msg.author.id, msg)
          } else TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
          break
        case "get":
          if (params.length >= 2) {
            TiCu.Profil.sendFieldValue(rawParams[1], msg.author.id, msg)
          } else TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
          break
        case "delete":
          if (params.length >= 2) {
            TiCu.Profil.deleteValue(rawParams[1], msg.author.id, msg)
          } else TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
          break
        default:
          const target = TiCu.Mention(params[0])
          if (target.user) {
            TiCu.Profil.sendProfilEmbed(target, msg)
          } else {
            TiCu.Log.Error("profil", "cible invalide", msg)
          }
      }
    } else {
      const target = TiCu.Mention(msg.author.id)
      TiCu.Profil.sendProfilEmbed(target, msg)
    }
  }
}
