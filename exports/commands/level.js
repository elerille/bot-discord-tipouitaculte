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
             const totalXpForNextLevel = TiCu.Xp.getXpByLevel(entry.level + 1)
             const totalXpForCurrentLevel = TiCu.Xp.getXpByLevel(entry.level)
             const xpInLevelForMember = entry.xp - totalXpForCurrentLevel
             const relativeXpForNextLevel = totalXpForNextLevel - totalXpForCurrentLevel
             const completionPercentage = Math.floor(xpInLevelForMember / relativeXpForNextLevel * 100)

             msg.channel.send(
               `${memberParam ? memberParam.displayName + ' est' : 'Vous êtes'} au niveau ${entry.level} avec un total de ${Math.floor(entry.xp)}XP\n` +
               `Le prochain niveau nécessite ${totalXpForNextLevel}XP et ${memberParam ? memberParam.displayName + ' est' : 'vous êtes'} à ${completionPercentage}% de complétion du niveau`
             )
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
