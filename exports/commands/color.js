let colorHexa = new RegExp(/^#[\da-f]{6}$/)
module.exports = {
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.tipoui.bots]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
  },
    name : "Color",
    desc : "Changer votre rôle-couleur.",
    schema : "!color <#RRGGBB>\nou\n!color none|remove|enlever|réinitialiser|turquoise",
    channels : "Maison des Bots",
    authors : "Tous",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    let input = params[0]
    let usr = msg.member
    let oldRole = usr.roles.find(e => e.name.match(colorHexa))
    let newRole = tipoui.roles.find(e => e.hexColor(input))
    if(usr.hasRole(PUB.tipoui.turquoise)) {
      if(input === "none" || input === "remove" || input === "enlever" || input === "réinitialiser" || input === "turquoise" || input === "#11e0e6"){
        if(!usr.roles.has(PUB.tipoui.turquoiseColor)) {
          usr.removeRole(getColorRole(oldRole))
          usr.addRole(PUB.tipoui.turquoiseColor)
          return TiCu.Log.Commands.Color("switched", "turquoise", msg)
        } else TiCu.Log.Error("color", "vous avez déjà la couleur par défaut du rang Turquoise")
      } else if(input.match(colorHexa)) {
        if(!newRole) {
          tipoui.createRole({name: input, color: input, position: "33"})
            .then(createdRole => {
              usr.addRole(createdRole)
            })
            .catch(TiCu.Log.Error("color", "impossible de créer ce rôle"))
        } else usr.addRole(newRole)
        usr.removeRole(oldRole)
        if(oldRole.members.legth === 0) {
          let oldRoleName = oldRole.name
          oldRole.delete()
          TiCu.Log.Commands.Color("deleted", oldRoleName, msg)
        }
        TiCu.Log.Commands.Color("switched", newRole.name, msg)
      } else TiCu.Log.Error("color", "paramètre de couleur invalide", msg)
    } else TiCu.Log.Error("color", "seul·es les Turquoises peuvent modifier leur rôle-couleur", msg)
  }
}
