module.exports = {
  alias: [
    "alert",
    "alerte"
  ],
  activated: true,
  name : "Alerte",
  desc : "Permet de lancer une alerte oud de s'inscrire/se désincrire sur la liste des alertæs",
  schema : "!alert (description de l'alerte)\nou\n!alerte (description de l'alerte)\nou\n!alerte (register|unregister)",
  authorizations : TiCu.Authorizations.getAuth("command", "alert"),
  run : function(params, msg, rawParams) {
    if (params[0] && (params[0] === "register" || params[0] === "unregister")) {
      if (params[0] === "register") {
        TiCu.Alerte.addMember(msg.author.id)
      } else {
        TiCu.Alerte.removeMember(msg.author.id)
      }
    } else {
      const alertDesc = TiCu.Messages.getTextFromRawParams(rawParams, 0)
      TiCu.Alerte.dmMembers(msg.channel.id, alertDesc === "" ? "Pas de détails" : alertDesc)
      TiCu.Alerte.sendVigi(msg.author.id, msg.channel.id, alertDesc === "" ? "Pas de détails" : alertDesc)
    }
    msg.delete()
  }
}