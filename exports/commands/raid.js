module.exports = {
  alias: [
    "raid"
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
    name : "Raid",
    desc : "Activer/Désactiver le lien d'invitation en cas de raid ou vérifier son état",
    schema : "!raid <[on|off|status]>",
    channels : "🐙interface-tipoui",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    switch(params[0]) {
      case "on":
        activeInvite = false
        TiCu.Log.Commands.Raid(params[0], msg)
        break
      case "off":
        activeInvite = true
        TiCu.Log.Commands.Raid(params[0], msg)
        break
      case "status":
      case "statut":
        msg.channel.send(`Le lien d'invitation est actuellement ${activeInvite ? 'activé (pas de raid en cours).' : 'désactivé (raid en cours).'}`)
        break
      default:
        TiCu.Log.Error("raid", "paramètre invalide", msg)
    }
  }
}
