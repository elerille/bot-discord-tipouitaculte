module.exports = {
  alias: [
    "return",
    "retour"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.invite.id]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
    },
    name : "Retour",
    desc : "Récupérer ses rôles après un départ volontaire relativement bref",
    schema : "!retour\nou\n!return"
  },
  run : function(params, msg) {
    const jsonActionData = {action : "read", target : ReturnFile}
    const returnData = TiCu.json(jsonActionData)
    if (returnData.members[msg.author.id]) {
      const memberData = returnData.members[msg.author.id]
      if (TiCu.Date("raw") - memberData.date < maxReturnTime) {
        msg.member.addRoles(memberData.roles).then(() => {
          for (const nmAlias of memberData.nm) {
            let access = []
            for (const nm of Object.values(PUB.nonmixtes)) {
              if (nm.alias[0] === nmAlias) {
                access.push(...nm.salons)
              }
            }
            for (const chan of access) {
              tipoui.channels.get(chan).overwritePermissions(msg.member, {VIEW_CHANNEL: true})
            }
          }
          delete returnData.members[msg.author.id]
          jsonActionData.action = "write"
          jsonActionData.content = returnData
          TiCu.json(jsonActionData)
          TiCu.Log.Commands.Retour(msg)
        })
      } else {
        TiCu.Log.Error("retour", "impossible de rendre les anciens rôles et accès car le départ est trop ancien. Il est toujours possible de me contacter pour de plus amples informations")
      }
    } else TiCu.Log.Error("retour", "impossible de retrouver les anciens rôles et accès.")
  }
}
