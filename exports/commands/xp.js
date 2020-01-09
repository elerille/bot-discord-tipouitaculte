module.exports = {
  alias: [
    "xp"
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
    name : "XP",
    desc : "Donner ou retirer de l'expérience à eun ou tous les membres",
    // TODO : donner ou retirer de l'expérience aux personnes possédant un rôle spécifique
    schema : "!xp <give|take> <@|all> <value> (reason)",
    channels : "🐙interface-tipoui",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    if (params.length < 3 || (params[0] !== "give" && params[0] !== "take") || isNaN(params[2])) {
      TiCu.Log.Error("xp", "paramètres invalides"', msg)
    } else {
      if (params[1] === "all") {
        TiCu.Xp.updateAllXp(params[0] === "give" ? "add" : "remove", Number(params[2]))
        TiCu.Log.Commands.Xp(msg, "all", params[2], params[0] === "give")
      } else {
        const memberParam = params[1] ? TiCu.Mention(params[1]) : null
        if (memberParam && tipoui.members.get(memberParam.id)) {
          TiCu.Xp.updateXp(params[0] === "give" ? "add" : "remove", Number(params[2]), memberParam.id)
          TiCu.Log.Commands.Xp(msg, memberParam.displayName, params[2], params[0] === "give")
        } else {
          TiCu.Log.Error("xp", "paramètres invalides", msg)
        }
      }
    }
  }
}
