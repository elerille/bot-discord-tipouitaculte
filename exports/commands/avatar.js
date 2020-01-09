module.exports = {
  alias: [
    "avatar"
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
    schema : "!avatar (@)",
    channels : "🐙la-maison-des-bots",
    authors : "Toustes",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    const target = params[0] ? TiCu.Mention(params[0]) : TiCu.Mention(msg.author.id)
    if (target.user) {
      TiCu.Profil.getBaseMemberProfil(target.id).then(
        entry => {
          msg.channel.send(
            new DiscordNPM.RichEmbed()
              .setColor(target.displayColor)
              .setAuthor("Avatar de ${target.displayName}", target.user.avatarURL)
              .setImage(entry && entry.avatar ? entry.avatar : target.user.avatarURL)
          )
          TiCu.Log.Commands.Avatar(msg, target)
        }
      )
    } else {
      TiCu.Log.Error("avatar", "cible invalide", msg)
    }
  }
}
