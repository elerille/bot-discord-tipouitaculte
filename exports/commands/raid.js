module.exports = {
  alias: [
    "raid"
  ],
  activated: true,
  name : "Raid",
  desc : "Activer/Désactiver le lien d'invitation en cas de raid ou vérifier son état",
  schema : "!raid <[on|off|status]>",
  authorizations : TiCu.Authorizations.getAuth("command", "raid"),
  run : function(params, msg) {
    if (!params && !msg) {
      activeInvite = false
      tipoui.fetchInvites().then(invites => invites.forEach(value => value.delete()))
      vigi.channels.resolve(PUB.servers.vigi.grandeTour).send(`Trop d'arrivées récentes, activation du mode raid et bans préventifs des dernières arrivées`)
    }
    if (params.length < 1) {
      return TiCu.Commands.help.run([this.alias[0]], msg)
    }
    switch(params[0]) {
      case "on":
        if (activeInvite) {
          activeInvite = false
          tipoui.fetchInvites().then(invites => invites.forEach(value => value.delete()))
          TiCu.Log.Commands.Raid(params[0], msg)
        } else {
          msg.reply(`pas de panique, le mode raid est déjà activé !`)
        }
        break
      case "off":
        if (!activeInvite) {
          activeInvite = true
          TiCu.Log.Commands.Raid(params[0], msg)
        } else {
          msg.reply(`tout va bien ! Le mode raid est déjà désactivé`)
        }
        break
      case "status":
      case "statut":
        msg.channel.send(`Le lien d'invitation est actuellement ${activeInvite ? 'activé (pas de raid en cours).' : 'désactivé (raid en cours).'}`)
        break
      default:
        TiCu.Commands.help.run([this.alias[0], "paramètre invalide"], msg)
    }
  }
}
