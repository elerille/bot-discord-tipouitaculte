module.exports = {
  alias: [
    "send"
  ],
  activated: true,
  name : "Send",
  desc : "Envoyer un message par l'intermédiaire de ce bot.",
  schema : "!send <target> <texte>",
  authorizations : TiCu.Authorizations.getAuth("command", "send"),
  run : function(params, msg) {
    if (params.length < 1) {
      return TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    }
    let crop = dev ? new RegExp(/^(%[s|S]end\s+[^\s]+\s+)/) : new RegExp(/^(![s|S]end\s+[^\s]+\s+)/)
    let target = TiCu.Mention(params[0]).id
    let content = msg.content.match(crop) ? msg.content.substring(msg.content.match(crop)[0].length) : false
    if(target) {
      if(content) {
        let type = Discord.channels.resolve(target) ? "channels" : Discord.users.resolve(target) ? "users" : false
        if(type){
          Discord[type].resolve(target).send(content)
            .then(sentMsg => TiCu.Log.Commands.Send(msg, sentMsg))
            .catch(error => TiCu.Log.Error("send", "erreur inattendue " + error, msg))
        } else TiCu.Log.Error("send", "envoyer à un rôle ?", msg)
      } else TiCu.Log.Error("send", "erreur invalide", msg)
    } else TiCu.Log.Error("send", "destination invalide", msg)
  }
}
