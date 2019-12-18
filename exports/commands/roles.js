module.exports = {
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.tipoui.debug, PUB.tipoui.botsecret]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
  },
    name : "Roles",
    desc : "Ajouter ou retirer des rôles à eun membre du serveur",
    schema : "!roles <@> <+|ajouter|add|addRoles> <[roles]>\nou\n!roles <@> <-|enlever|retirer|supprimer|remove|removeRoles> <[roles]>",
    channels : "Bots Vigilant·es",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    let action
    let roles = []
    let target = TiCu.Mention(params[0])
    switch(params[1]) {
      case "ajouter":
      case "add":
      case "+":
      case "addroles":
        action = "addRoles"
        break
      case "enlever":
      case "retirer":
      case "supprimer":
      case "remove":
      case "removeroles":
      case "-":
      case "removeRoles":
        action = "removeRoles"
        break
      default:
        action = false
    }
    for(let i=2;i<params.length;i++) {
      for(let j=0;j<PUB.rolesA.length;j++) {
        if(PUB.rolesA[j].find(k => k === params[i])) {
          roles.push(PUB.rolesA[j][0])
          break
        }
      }
    }
    if(target) {
      if(action) {
        if(roles && roles.length === params.length - 2) {
          target[action](roles)
            .then(() => TiCu.Log.Commands.Roles(target, action, roles, msg))
            .catch(() => TiCu.Log.Error("roles", "erreur API", msg))
        } else TiCu.Log.Error("roles", "liste de rôles invalide", msg)
      } else TiCu.Log.Error( "roles", "ajouter ou enlever ?", msg)
    } else TiCu.Log.Error( "roles", "destination invalide", msg)
  }
}
