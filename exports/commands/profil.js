module.exports = {
  alias: [
    'profil'
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
    desc : "Afficher le profil d'eun membre ou modifier son propre profil",
    schema : "!profil (@|set|get|delete) (champs) (value)",
    channels : "🦄la-maison-de-la-bot",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg, rawParams) {
    if (params[0]) {
      switch (params[0]) {
        case 'set':
          if (params.length >= 3) {
            rawParams.shift()
            let fieldName = rawParams.shift()
            let fieldValue = ''
            for (const rawParam of rawParams) {
              fieldValue += (rawParam + ' ')
            }
            TiCu.Profil.setValue(fieldName, fieldValue.substr(0, fieldValue.length-1), msg.author.id, msg)
          } else TiCu.Log.Error('profil', "Vous devez précsier quel champs vous souhaitez modifier et sa nouvelle valeur", msg)
          break
        case 'get':
          if (params.length >= 2) {
            TiCu.Profil.sendFieldValue(rawParams[1], msg.author.id, msg)
          } else TiCu.Log.Error('profil', "Vous devez préciser quel champs vous souhaitez afficher", msg)
          break
        case 'delete':
          if (params.length >= 2) {
            TiCu.Profil.deleteValue(rawParams[1], msg.author.id, msg)
          } else TiCu.Log.Error('profil', "Vous devez préciser quel champs vous souhaitez supprimer", msg)
          break
        default:
          const target = TiCu.Mention(params[0])
          if (target.user) {
            TiCu.Profil.sendProfilEmbed(target, msg)
          } else {
            TiCu.Log.Error('profil', "Cible invalide : l'élément recherché n'est pas eun utilisateurice", msg)
          }
      }
    } else {
      const target = TiCu.Mention(msg.author.id)
      TiCu.Profil.sendProfilEmbed(target, msg)
    }
  }
}
