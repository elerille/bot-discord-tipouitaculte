const DiscordNPM = require("discord.js")
module.exports = {
  authorizations : {
    chans : {
      type: "any"
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
    },
    name : "Help",
    desc : "Liste toutes les commandes, ou seulement celles que vous pouvez utiliser dans ce salon (par défaut), détaille l'usage d'une commande, ou explique le format des \"schémas\" de commandes.",
    schema : "!help (full|commande|schema)",
    channels : "Tous",
    authors : "Tous",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    let target = params[0]
    let embed = new DiscordNPM.RichEmbed()
    embed.setColor(38600)
    if(TiCu.Commands[target]) {
      embed.setTitle(cmd.name)
      embed.addField("Description", cmd.desc)
      embed.addField("Schéma", cmd.schema)
      embed.addBlankField()
      embed.add
      msg.channel.send("Voici la liste exhaustive de mes fonctions :")
      msg.channel.send({ embed })
    } else if(target === "full") {
      Object.keys(TiCu.Commands).forEach((key, i, array) => {
        let cmd = TiCu.Commands[key].authorizations
        embed.addField(cmd.name, cmd.desc)
      })
      msg.channel.send("Voici la liste exhaustive de mes fonctions :")
      msg.channel.send({ embed })
    } else if(target === "schema") {
      embed.setTitle("La description individuelle des commandes propose un champ \"Schéma\" pour savoir comment utiliser la commande associée.")
      embed.addField("`!commande`", "appel de la commande, le message commence par un `!` et le nom de la commande.")
      embed.addField("`<obligatoire>`", "entre chevrons, ce paramètre doit impérativement être renseigné lors de l'appel de la commande.")
      embed.addField("`[liste]`", "entre crochets, ce paramètre est une liste de 1 ou plusieurs éléments, séparés par des caractères d'espacement (tout espace unicode, y compris retour à la ligne), obligatoires pour l'appel de la commande.")
      embed.addField("`(optionnel)`", "entre parenthèses, ce paramètre est facultatif et ne doit pas obligatoirement être présent pour faire fonctionner cette commande.")
      embed.addField(`|`, "la barre verticale permet de délimiter les variantes d'un paramètre. Par exemple, !piece (pile|face) signifie que l'on peut choisir si l'on gagne avec pile ou avec face.")
      embed.addField(`@`, "l'arobase signifie que le paramètre attendu permet de trouver eun membre de Tipoui - par mention (<@638410922527817748>), ID (638410922527817748), tag (TipouiTaCulte#4219), nom d'utilisateurice (TipouiTaCulte) ou encore pseudo sur le serveur (💠TipouiTaCulte (x)).")
      embed.addField("`role`", "le mot-clef \"role\" signifie que le paramètre attendu permet de trouver un rôle sur Tipoui, d'après la liste donnée par la commande `!help rolesList`")
      embed.addField("`target`", "le mot-clef \"target\" signifie que le paramètre attendu permet de trouver une cible, qui peut être, selon le contexte, eun membre, un salon et/ou un rôle - par mention, ID ou nom en texte brut")
      embed.addField("`text`", "le mot-clef \"text\" signifie que tout le reste du texte du message sera transmis suite à cette commande.")
      embed.addField("", "Pour les commandes ne comportant pas de paramètre `texte`, tout contenu faisant suite aux paramètres nécessaires ne sera pas traîté.")
      embed.addField("", "Les mots-clefs qui ne font pas partie de cette liste doivent être renseignés tels quels dans la commande (ils font généralement partie d'un groupe de paramètres variables, comme `(pile|face)` ou `<add|addRole|ajouter>` ...).")
      embed.addField("", "Par ailleurs, les paramètres de commande ne sont pas sensibles à la casse, de telle sorte que `addRole`, `ADDROLE` ou `addrole` seront tous traités de la même façon.")
      msg.channel.send(embed)
    } else if(target === "rolesList") {
      embed.addField("TROLL", "Ouais j'ai pas encore fait cette liste à la noix mdr")
      msg.channel.send({ embed })
    } else if(!target) {
      Object.keys(TiCu.Commands).forEach((key, i, array) => {
        if(key != "help") {
          if(TiCu.Authorizations(key, msg)) {
            let cmd = TiCu.Commands[key].authorizations
            embed.addField(cmd.name, cmd.desc)
            embed.addField("Schéma", cmd.schema)
          }
        }
      })
      msg.channel.send("Voici la liste de mes fonctions que vous pouvez utiliser :")
      msg.channel.send({ embed })
    } else {
      TiCu.Log.Error("help", "commande inconnue", msg)
    }
  }
}
