function checkRoleUsage(role, usr, msg) {
  if((role.members.size === 1 && role.members.get(msg.member.id) || role.members.size === 0) && role.name !== "#11e0e6") {
    let roleName = role.name
    role.delete()
    TiCu.Log.Commands.Color("deleted", roleName, msg)
  }
}

module.exports = {
  alias: [
    "color"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.bots.id]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
  },
    name : "Color",
    desc : "Changer votre rôle-couleur. La réaction \"♻\" indique que votre précédent rôle-couleur a été supprimé car vous étiez la dernière personne à l'utiliser.",
    schema : "!color <#RRGGBB>\nou\n!color none|remove|reset|enlever|réinitialiser|turquoise"
  },
  run : function(params, msg) {
    let input = params[0]
    let usr = msg.member
    let oldRole = usr.roles.find(e => !!e.name.match(colorHexa))
    let newRole = tipoui.roles.find(e => e.hexColor === input)
    if(usr.roles.get(PUB.roles.turquoise.id)) {
      if(input === "none" || input === "remove" || input === "reset" || input === "enlever" || input === "réinitialiser" || input === "turquoise" || input === "#11e0e6"){
        if(!usr.roles.has(PUB.roles.turquoiseColor.id)) {
          usr.addRole(PUB.roles.turquoiseColor.id)
          if(oldRole) {
            usr.removeRole(oldRole)
            checkRoleUsage(oldRole, usr, msg)
          }
          return TiCu.Log.Commands.Color("switched", "turquoise", msg)
        } else TiCu.Log.Error("color", "vous avez déjà la couleur par défaut du rang Turquoise", msg)
      } else {
        if(input.match(colorHexa)) {
          if(!newRole) {
            tipoui.createRole({name: input, color: input, position: 33})
              .then(createdRole => {
                usr.addRole(createdRole)
                if(oldRole) {
                  usr.removeRole(oldRole)
                  checkRoleUsage(oldRole, usr, msg)
                }
                return TiCu.Log.Commands.Color("switched", createdRole.name, msg)
                })
          } else {
            usr.addRole(newRole)
            if(oldRole) {
              usr.removeRole(oldRole)
              checkRoleUsage(oldRole, usr, msg)
            }
            return TiCu.Log.Commands.Color("switched", newRole.name, msg)
          }
        } else TiCu.Log.Error("color", "paramètre de couleur invalide (format `#RRGGBB`)", msg)
      }
    } else TiCu.Log.Error("color", "seul·es les Turquoises peuvent modifier leur rôle-couleur", msg)
  }
}
