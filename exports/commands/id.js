const MAX_NB_RESULTS = 10

module.exports = {
  alias: [
    "id",
    "search",
    "recherche"
  ],
  activated: true,
  name : "Chercheur d'id",
  desc : "Recherche les identifiants pouvant correspondre à l'élément recherché",
  schema : "!id <searchExpresssion>",
  authorizations : TiCu.Authorizations.getAuth("command", "id"),
  run : function(params, msg, rawParams) {
    if (params.length < 1) {
      return TiCu.Commands.help.run([this.alias[0], "il manque des paramètres"], msg)
    }
    const searchExpr = TiCu.Messages.getTextFromRawParams(rawParams, 0).trim().toLowerCase()
    const mention = TiCu.Mention(searchExpr)
    if (!mention) {
      const members = []
      for (const member of tipoui.members) {
        if (member[1].nickname ? member[1].nickname.toLowerCase().indexOf(searchExpr) !== -1 : member[1].user.username.toLowerCase().indexOf(searchExpr) !== -1) {
          members.push(member[1])
        }
      }
      const channels = []
      for (const channel of tipoui.channels) {
        if (channel[1].name.toLowerCase().indexOf(searchExpr) !== -1) {
          channels.push(channel[1])
        }
      }
      const roles = []
      for (const role of tipoui.roles) {
        if (role[1].name.toLowerCase().indexOf(searchExpr) !== -1) {
          roles.push(role[1])
        }
      }
      if (members.length + channels.length + roles.length > MAX_NB_RESULTS) {
        TiCu.Log.Error("id", "la recherche n'est pas assez spécifique et retourne trop de résultats", msg)
      } else if (members.length + channels.length + roles.length === 0) {
        TiCu.Log.Error("id", "la recherche n'a retourné aucun résultat", msg)
      } else {
        let result = ""
        if (members.length > 0) {
          result += "Liste des membres correspondant·e·s à la recherche :\n"
          for (const member of members) {
            result += `   <@${member.id}> : ${member.id}\n`
          }
        }
        if (channels.length > 0) {
          result += "Liste des salons correspondants à la recherche :\n"
          for (const channel of channels) {
            result += `   <#${channel.id}> : ${channel.id}\n`
          }
        }
        if (roles.length > 0) {
          result += "Liste des rôles correspondants à la recherche :\n"
          for (const role of roles) {
            result += `   <@&${role.id}> : ${role.id}\n`
          }
        }
        msg.channel.send(result)
      }
    } else {
      TiCu.Log.Error("id", "la recherche entrée est déjà utilisable telle quelle", msg)
    }
  }
}