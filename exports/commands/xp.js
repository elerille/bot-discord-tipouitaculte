function giveXpMembers(targetCollection, params, reason, msg) {
  targetCollection.members.forEach((member, id) => {
    if (!member.user.bot) {
      TiCu.Xp.updateXp(params[0] === "give" ? "add" : "remove", Number(params[2]), id)
    }
  })
  TiCu.Log.Commands.Xp(targetCollection.name, params[2], params[0] === "give", reason, msg)
}

module.exports = {
  alias: [
    "xp"
  ],
  activated: true,
  name : "XP",
  desc : "Donner ou retirer de l'expérience à eun ou tous les membres",
  schema : "!xp <give|take> <@|all|role|channel> <value> (reason)",
  authorizations : TiCu.Authorizations.getAuth("command", "xp"),
  run : function(params, msg, rawParams) {
    if (params.length < 3 || (params[0] !== "give" && params[0] !== "take") || isNaN(params[2])) {
      TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    } else {
      let reason = ""
      for (let i=3;i<rawParams.length;i++) {
        reason = reason + " " + rawParams[i]
      }
      if (params[1] === "all") {
        TiCu.Xp.updateAllXp(params[0] === "give" ? "add" : "remove", Number(params[2]))
        TiCu.Log.Commands.Xp("all", params[2], params[0] === "give", reason, msg)
      } else {
        const mentionParam = params[1] ? TiCu.Mention(params[1]) : null
        if (mentionParam) {
          if (tipoui.members.get(mentionParam.id)) {
            TiCu.Xp.updateXp(params[0] === "give" ? "add" : "remove", Number(params[2]), mentionParam.id)
            TiCu.Log.Commands.Xp(mentionParam.displayName, params[2], params[0] === "give", reason, msg)
          } else if (tipoui.roles.get(mentionParam.id) || tipoui.channels.get(mentionParam.id)) {
            giveXpMembers(mentionParam, params, reason, msg)
          } else {
            TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
          }
        } else {
          let roleId = ""
          for (const role of Object.values(PUB.roles)) {
            for (const roleAlias of role.alias) {
              if (roleAlias === params[1]) {
                roleId = role.id
                break
              }
            }
            if (roleId) {
              giveXpMembers(tipoui.roles.get(roleId), params, reason, msg)
              break
            }
          }
          if (!roleId) TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
        }
      }
    }
  }
}
