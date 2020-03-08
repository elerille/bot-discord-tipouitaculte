function createAvatarEmbed(target, entry = undefined) {
  return new DiscordNPM.RichEmbed()
    .setColor(target.displayColor)
    .setAuthor(`Avatar de ${target.displayName}`, target.user.avatarURL)
    .setImage(entry && entry.avatar ? entry.avatar : target.user.avatarURL)
}

module.exports = {
  alias: [
    "avatar"
  ],
  activated: true,
  name : "Avatar",
  desc : "Afficher l'avatar d'eun membre",
  schema : "!avatar (profil) (@)",
  authorizations : TiCu.Authorizations.getAuth("command", "avatar"),
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
            TiCu.Log.Commands.Avatar(target, msg)
          }
        )
      } else {
        msg.channel.send(createAvatarEmbed(target))
        TiCu.Log.Commands.Avatar(target, msg)
      }
    } else {
      TiCu.Log.Error("avatar", "cible invalide", msg)
    }
  }
}
