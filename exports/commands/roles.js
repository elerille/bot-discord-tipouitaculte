module.exports = {
  alias: [
    "roles"
  ],
  activated: true,
  name : "Roles",
  desc : "Ajouter ou retirer des rôles à eun membre du serveur",
  schema : "!roles <@> <+|ajouter|add|addRoles> <[rolesList]>\nou\n!roles <@> <-|enlever|retirer|supprimer|remove|removeRoles> <[rolesList]>",
  authorizations : TiCu.Authorizations.getAuth("command", "roles"),
  run : function(params, msg) {
    if (params.length < 1) {
      return TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    }
    let action
    let roles = []
    let target = TiCu.Mention(params[0])
    switch(params[1]) {
      case "ajouter":
      case "add":
      case "+":
      case "addroles":
        action = "add"
        break
      case "enlever":
      case "retirer":
      case "supprimer":
      case "remove":
      case "removeroles":
      case "-":
      case "removeRoles":
        action = "remove"
        break
      default:
        action = false
    }
    for(let i=2;i<params.length;i++) {
      for (const role of Object.values(PUB.roles)) {
        if (role.givable) {
          if (role.alias.find(j => j === params[i])) {
            roles.push(role.id)
            break
          }
        }
      }
    }
    if(target) {
      if(action) {
        if(roles && roles.length === params.length - 2) {
          target.roles[action](roles)
            .then(() => TiCu.Log.Commands.Roles(target, action, roles, msg))
            .catch(() => TiCu.Log.Error("roles", "erreur API", msg))
        } else TiCu.Log.Error("roles", "liste de rôles invalide", msg)
      } else TiCu.Log.Error( "roles", "ajouter ou enlever ?", msg)
    } else TiCu.Log.Error( "roles", "destination invalide", msg)
  }
}
