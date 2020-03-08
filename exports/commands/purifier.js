module.exports = {
  alias: [
    "purifier"
  ],
  activated: true,
  name : "Purifier",
  desc : "Accorder l'accès au salon du Bûcher et le rôle de Pourfendeureuse de Cismecs à eun membre.",
  schema : "!purifier <@>",
  authorizations : TiCu.Authorizations.getAuth("command", "purifier"),
  run : function(params, msg) {
    let target
    if(TiCu.Mention(params[0])) {target = TiCu.Mention(params[0])} else return TiCu.Log.Error("purifier", "cible invalide", msg)
    if(!target.roles.find(e => e.id === PUB.roles.pourfendeureuse.id)) {
      target.addRole(PUB.roles.pourfendeureuse.id)
      TiCu.Log.Commands.Purifier(target, msg)
    } else return TiCu.Log.Error("purifier", "cible déjà Pourfendeureuse de Cismecs", msg)
  }
}
