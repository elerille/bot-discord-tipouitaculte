module.exports = {
  alias: [
    "bienvenue"
  ],
  activated: true,
  name : "Bienvenue",
  desc : "Accorder le rôle Phosphate à eun membre.",
  schema : "!bienvenue <@>",
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.invite.id]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "whitelist",
      list: [PUB.roles.turquoise.id]
    }
  },
  run : function(params, msg) {
    let target
    if(TiCu.Mention(params[0])) {target = TiCu.Mention(params[0])} else return TiCu.Log.Error("bienvenue", "cible invalide", msg)
    if(!target.roles.find(e => e.id === PUB.roles.phosphate.id)) {
      target.addRole(PUB.roles.phosphate.id)
      TiCu.Log.Commands.Bienvenue(target, msg)
    } else return TiCu.Log.Error("bienvenue", "cible déjà phosphate", msg)
  }
}
