function generateProgressionBar(percentage) {
  const complete = '▰'
  const incomplete = '▱'
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
    embed.addField("Prochain niveau dans", relativeXpForNextLevel)
    embed.addField("Complétion du niveau", `${completionPercentage}%\n${generateProgressionBar(completionPercentage)}`, true)
  }
  return embed
}

module.exports = {
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.tipoui.debug, PUB.tipoui.bots]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
    },
    name : "Level",
    desc : "Afficher le niveau d'un membre.",
    schema : "!level (@)",
    channels : "🦄la-maison-de-la-bot",
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
           } else {
             msg.channel.send(`${memberParam ? 'Le compte de ' + memberParam.displayName : 'Votre compte'} est désactivé dans le système`)
           }
         } else {
           msg.channel.send('Impossible de retrouver votre cible dans le système')
           TiCu.Log.Commands.Level(target)
         }
       }
     )
  }
}
