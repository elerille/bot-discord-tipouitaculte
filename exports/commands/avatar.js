function createAvatarEmbed(target, entry = undefined) {
  return new DiscordNPM.RichEmbed()
    .setColor(target.displayColor)
    .setAuthor(`Avatar de ${target.displayName}`, target.user.avatarURL)
    .setImage(entry && entry.avatar ? entry.avatar : target.user.avatarURL)
}

module.exports = {
  alias: [
    'avatar'
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
    name : "Avatar",
    desc : "Afficher l'avatar d'eun membre",
    schema : "!avatar (profil) (@)",
    channels : "🦄la-maison-de-la-bot",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    const target = params[0] ?
      params[0] === 'profil' ?
        params[1] ?
          TiCu.Mention(params[1]) :
          TiCu.Mention(msg.author.id)
        : TiCu.Mention(params[0])
      : TiCu.Mention(msg.author.id)
    if (target.user) {
      if (params[0] && params[0] === 'profil') {
        TiCu.Profil.getBaseMemberProfil(target.id).then(
          entry => {
            msg.channel.send(createAvatarEmbed(target, entry))
            TiCu.Log.Commands.Avatar(msg, target)
          }
        )
      } else {
        msg.channel.send(createAvatarEmbed(target))
        TiCu.Log.Commands.Avatar(msg, target)
      }
    } else {
      TiCu.Log.Error('avatar', "Cible invalide : l'élément recherché n'est pas eun utilisateurice", msg)
    }
  }
}
