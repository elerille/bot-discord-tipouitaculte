function generateProgressionBar(percentage) {
  const complete = "▰"
  const incomplete = "▱"
  let bar = ""
  for (let i=0;i<10;i++) {
    if (percentage >= (i+1)*10) {
      bar += complete
    } else {
      bar += incomplete
    }
  }
  return bar
}

function makeEmbed(user, msg, entry) {
  const totalXpForNextLevel = TiCu.Xp.getXpByLevel(entry.level + 1)
  const totalXpForCurrentLevel = TiCu.Xp.getXpByLevel(entry.level)
  const xpInLevelForMember = entry.xp - totalXpForCurrentLevel
  const relativeXpForNextLevel = totalXpForNextLevel - totalXpForCurrentLevel
  const completionPercentage = Math.floor(xpInLevelForMember / relativeXpForNextLevel * 100)
  const embed = new DiscordNPM.RichEmbed()
    .setColor(user.displayColor)
    .setAuthor(`Niveau de ${user.displayName}`, user.user.avatarURL, msg.url)
  embed.addField("Niveau", entry.level, true)
  embed.addField("Expérience", Math.floor(entry.xp), true)
  if (user.roles.get(PUB.roles.turquoise.id)) {
    embed.addField("Prochain niveau dans", Math.floor(relativeXpForNextLevel - xpInLevelForMember))
    embed.addField("Complétion du niveau", `${completionPercentage}%\n${generateProgressionBar(completionPercentage)}`, true)
  }
  return embed
}

module.exports = {
  alias: [
    "level",
    "niveau"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.botsecret.id, PUB.salons.bots.id]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
    },
    name : "Level",
    desc : "Afficher le niveau d'eun membre.",
    schema : "!level (@)",
    channels : "🐙la-maison-des-bots",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    const memberParam = params[0] ? TiCu.Mention(params[0]) : null
    const target = memberParam ? memberParam.id : msg.author.id
     TiCu.Xp.getMember(target).then(
       entry => {
         if (entry) {
           if (entry.activated) {
             msg.channel.send(makeEmbed(tipoui.members.get(target), msg, entry))
             TiCu.Log.Commands.Level(target, msg)
           } else {
             TiCu.Log.Error("level", "compte désactivé dans le système d'expérience", msg)
           }
         } else {
           TiCu.Log.Error("level", "cible invalide ou erreur de base de données", msg)
         }
       }
     )
  }
}
