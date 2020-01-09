module.exports = {
  alias: [
    "profil"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.bots.id]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
    },
    name : "Profil",
    desc : "Afficher le profil d'eun membre ou modifier son propre profil.",
    schema : "!profil (@)\nou\n!profil <set> <champ> <valeur>\nou\n!profil <delete|get> <champ>",
    channels : "🐙la-maison-des-bots",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg, rawParams) {
    if (params[0]) {
      switch (params[0]) {
        case "set":
          if (params.length >= 3) {
            rawParams.shift()
            let fieldName = rawParams.shift()
            let fieldValue = ""
            for (const rawParam of rawParams) {
              fieldValue += (rawParam + " ")
            }
            TiCu.Profil.setValue(fieldName, fieldValue.substr(0, fieldValue.length-1), msg.author.id, msg)
          } else TiCu.Log.Error("profil", "paramètres invalides", msg)
          break
        case "get":
          if (params.length >= 2) {
            TiCu.Profil.sendFieldValue(rawParams[1], msg.author.id, msg)
          } else TiCu.Log.Error("profil", "paramètres invalides", msg)
          break
        case "delete":
          if (params.length >= 2) {
            TiCu.Profil.deleteValue(rawParams[1], msg.author.id, msg)
          } else TiCu.Log.Error("profil", "paramètres invalides", msg)
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
