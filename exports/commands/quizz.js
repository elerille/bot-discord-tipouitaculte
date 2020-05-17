module.exports = {
  alias: [
    "quizz"
  ],
  activated: true,
  name : "Quizz",
  desc : "Outil de gestion du quizz",
  schema : "!quizz <m|members>\n!quizz <am|addmember> <teamName> <@member>\n!quizz <rm|removemember> <@member>\n!quizz <p|points> (teamName) (+|-) (valeur)\n!quizz <rn|rename> <oldName> <newName>",
  authorizations : TiCu.Authorizations.getAuth("command", "quizz"),
  run : function(params, msg) {
    if (params.length < 1) return TiCu.Commands.help.run([this.alias[0], "aucun paramètre"], msg)
    let result = ""
    switch (params[0]) {
      case "members":
      case "m":
        const teamMembers = TiCu.Quizz.getMembers()
        for (const team of Object.keys(teamMembers)) {
          result += `Membres de l'équipe **${team}** :\n`
          if (teamMembers[team].length === 0) {
            result += "  -> Pas de membre\n"
          } else {
            for (const memberId of teamMembers[team]) {
              const tipouiMember = tipoui.members.get(memberId)
              result += `  -> ${tipouiMember ? tipouiMember.nickname : "Utilisateur inconnu"} - ${memberId}\n`
            }
          }
        }
        msg.channel.send(result)
        break
      case "addmember":
      case "am":
        if (params.length < 3) return TiCu.Commands.help.run([this.alias[0], "il manque des paramètres pour ajouter un membre à une équipe"], msg)
        switch(TiCu.Quizz.addMember(params[2], params[1])) {
          case 0:
            msg.react("✅")
            break
          case 1:
            msg.channel.send(`Læ membre ${params[2]} fait déjà partie d'une équipe`)
            break
          case 2:
            msg.channel.send(`L'équipe ${params[1]} n'existe pas`)
            break
          case 3:
            msg.channel.send(`${params[2]} ne fait pas partie de Tipoui`)
            break
        }
        break
      case "removemember":
      case "rm":
        if (params.length < 2) return TiCu.Commands.help.run([this.alias[0], "il manque læ membre à retirer"], msg)
        if (TiCu.Quizz.removeMember(params[1])) msg.react("✅")
        else msg.channel.send(`Quelque chose semble s'être mal passé...`)
        break
      case "points":
      case "point":
      case "p":
        if (params.length === 1) {
          const teamPoints = TiCu.Quizz.getPoints()
          for (const team of Object.keys(teamPoints)) {
            result += `Score de l'équipe **${team}** : ${teamPoints[team]} points\n`
          }
          msg.channel.send(result)
        } else {
          if (params.length < 4) return TiCu.Commands.help.run([this.alias[0], "il manque des paramètres pour ajouter ou retirer des poins à une équipe"], msg)
          switch(TiCu.Quizz.changePoints(params[1], params[2], params[3])) {
            case 0:
              msg.react("✅")
              break
            case 1:
              msg.channel.send(`L'opérateur ${params[2]} n'est pas reconnu`)
              break
            case 2:
              msg.channel.send(`La valeur ${params[3]} n'est pas numérique`)
              break
            case 3:
              msg.channel.send(`L'équipe ${params[1]} n'existe pas`)
              break
          }
        }
        break
      case "rename":
      case "rn":
        if (params.length < 3) return TiCu.Commands.help.run([this.alias[0], "il manque des paramètres pour changer le nom d'une équipe"], msg)
        if (TiCu.Quizz.renameTeam(params[1], params[2])) msg.react("✅")
        else msg.channel.send(`L'équipe ${params[1]} n'existe pas`)
        break
      default:
        TiCu.Commands.help.run([this.alias[0], "Le premier paramètre de commande n'est pas reconnu"], msg)
        break
    }
  }
}