module.exports = {
  alias: [
    "slowmode",
    "slow"
  ],
  activated: true,
  name : "Slowmode",
  desc : "Activer ou désactiver le slowmode d'un salon (temps exprimé en minutes, par défaut 5 minutes)",
  schema : "!<slow|slowmode> <on|off> <#channel> (temps) (message)",
  authorizations : TiCu.Authorizations.getAuth("command", "slowmode"),
  run : function(params, msg, rawParams) {
    if (params.length < 2) {
      return TiCu.Commands.help.run([this.alias[0], "il manque des paramètres"], msg)
    }
    const resRegChannel = params[1].match(/(<#)?([0-9]+)(>)?/)
    let channel
    if (resRegChannel) {
      channel = tipoui.channels.resolve(resRegChannel[2])
    }
    if (!channel) {
      return TiCu.Commands.help.run([this.alias[0], "le second paramètre doit être un identifiant de salon"], msg)
    }
    if (params[0] === "on") {
      let rateLimit = 5
      let reason = ""
      if (params.length > 2) {
        if (!isNaN(params[2])) {
          rateLimit = Math.floor(Number(params[2]))
          if (params.length > 3) {
            reason = TiCu.Messages.getTextFromRawParams(rawParams, 3)
          }
        } else {
          reason = TiCu.Messages.getTextFromRawParams(rawParams, 2)
        }
      }
      channel.setRateLimitPerUser(rateLimit * 60).then(() => {
        channel.send(reason !== "" ? reason : "Le slowmode a été activé sur ce salon par les Vigilant·es")
        msg.channel.send(`Le slowmode a été activé sur le salon <#${resRegChannel[2]}>`)
      })
    } else if (params[0] === "off") {
      channel.setRateLimitPerUser(0).then(() => msg.channel.send(`Le slowmode a été désactivé sur le salon <#${resRegChannel[2]}>`))
    } else {
      return TiCu.Commands.help.run([this.alias[0], "le premier paramètre doit être `on` ou `off`"], msg)
    }
  }
}