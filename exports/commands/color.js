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
  name : "Color",
  desc : "Changer votre rôle-couleur. La réaction \"♻\" indique que votre précédent rôle-couleur a été supprimé car vous étiez la dernière personne à l'utiliser.",
  schema : "!color <#RRGGBB>\nou\n!color none|remove|reset|enlever|réinitialiser|turquoise",
  authorizations : TiCu.Authorizations.getAuth("command", "color"),
  run : function(params, msg) {
    if (params.length < 1) {
      return TiCu.Commands.help.run([this.alias[0], "pas de paramètre de couleur"], msg)
    }
    let input = params[0]
    input = (input === "#000000") ? "#010101" : input
    let usr = msg.member
    let oldRole = usr.roles.cache.find(e => !!e.name.match(colorHexa))
    let newRole = tipoui.roles.cache.find(e => e.hexColor === input)
    if(usr.roles.cache.get(PUB.roles.turquoise.id)) {
      if(input === "none" || input === "remove" || input === "reset" || input === "enlever" || input === "réinitialiser" || input === "turquoise" || input === "#11e0e6"){
        if(!usr.roles.cache.has(PUB.roles.turquoiseColor.id)) {
          usr.roles.add(PUB.roles.turquoiseColor.id)
          if(oldRole) {
            usr.roles.remove(oldRole)
            checkRoleUsage(oldRole, usr, msg)
          }
          return TiCu.Log.Commands.Color("switched", "turquoise", msg)
        } else TiCu.Log.Error("color", "vous avez déjà la couleur par défaut du rang Turquoise", msg)
      } else {
        if(input.match(colorHexa)) {
          if(!newRole) {
            tipoui.roles.create({data: {name: input, color: input, position: 33}})
              .then(createdRole => {
                usr.roles.add(createdRole)
                if(oldRole) {
                  usr.roles.remove(oldRole)
                  checkRoleUsage(oldRole, usr, msg)
                }
                return TiCu.Log.Commands.Color("switched", createdRole.name, msg)
                })
          } else {
            usr.roles.add(newRole)
            if(oldRole) {
              usr.roles.remove(oldRole)
              checkRoleUsage(oldRole, usr, msg)
            }
            return TiCu.Log.Commands.Color("switched", newRole.name, msg)
          }
        } else return TiCu.Commands.help.run([this.alias[0], "paramètre de couleur invalide (format `#RRGGBB`)"], msg)
      }
    } else TiCu.Log.Error("color", "seul·es les Turquoises peuvent modifier leur rôle-couleur", msg)
  }
}
