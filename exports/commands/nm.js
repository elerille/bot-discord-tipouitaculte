module.exports = {
  alias: [
    "nm",
    "non-mixte",
    "non-mixtes"
  ],
  activated: true,
  name : "Non-Mixtes",
  desc : "Ajouter ou retirer l'accès à des salons non-mixte sans rôle",
  schema : "!<nm|non-mixte|non-mixtes> <@> <+|autoriser|ajouter|add> <[nmList]>\nou\n!<nm|non-mixte|non-mixtes> <@> <-|révoquer|retirer|remove> <[nmList]>",
  authorizations : TiCu.Authorizations.getAuth("command", "nm"),
  run : function(params, msg) {
    let action = {}
    let access = []
    let vigi = false
    let target = TiCu.Mention(params[0])
    switch(params[1]) {
      case "ajouter":
      case "add":
      case "+":
        action.VIEW_CHANNEL = true
        break
      case "enlever":
      case "retirer":
      case "remove":
      case "-":
        action.VIEW_CHANNEL = false
        break
      default:
        break
    }
    for(let i=2;i<params.length;i++) {
      for (const nm of Object.values(PUB.nonmixtes)) {
        if(nm.alias.find(j => j === params[i])) {
          if(nm.alias[0] === "vigi") {
            vigi = true
          }
          access.push(...nm.salons)
          break
        }
      }
    }
    if(target) {
      if(Object.keys(action).length === 1) {
        if(access && access.length > 0) {
          if(vigi) {
            if(msg.member.roles.has(PUB.tipoui.roles.nso.id) || msg.user.id === PUB.tipoui.users.yuffy.id || msg.user.id === PUB.tipoui.users.xenolune.id) {
              Discord.guilds.get(PUB.servers.vigi).channels.get("554775874293989407").createInvite()
                .then(invite => target.send(`Bienvenue pami les Vigilant·es, félicitations pour la confiance que nous t'accordons, et merci pour celle que tu nous accordes.\nDe nouveaux salons te sont accessibles sur Tipoui Community +, ainsi que le serveur Vigi au complet, qui nous aide à séparer nos activités et à nous reposer un peu si besoin.\n${invite.url}`))
            } else return TiCu.Log.Error("non-mixtes", "seules les admins peuvent ajouter de nouveaulles Vigilant·es", msg)
          }
          const promises = []
          for(const chan of access) {
            promises.push(tipoui.channels.get(chan).overwritePermissions(target, action))
          }
          Promise.all(promises).then(() => TiCu.Log.Commands.NM(target, action.VIEW_CHANNEL, access.length, msg))
            .catch(() => TiCu.Log.Error("NM", `erreur API, une admin doit vérifier les autorisations`, msg))
        } else TiCu.Log.Error("NM", "liste d'accès invalide", msg)
      } else TiCu.Log.Error( "NM", "autoriser ou révoquer ?", msg)
    } else TiCu.Log.Error( "NM", "destination invalide", msg)
  }
}
