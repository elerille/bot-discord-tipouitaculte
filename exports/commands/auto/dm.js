const DiscordNPM = require("discord.js")
module.exports = function(msg) {
  let user = tipoui.members.get(msg.author.id) ? tipoui.members.get(msg.author.id) : false
  if(user) {
    let embed = new DiscordNPM.RichEmbed()
      .setColor(user.displayColor)
      .setAuthor(user.displayName, user.user.avatarURL, msg.url)
      .setDescription(msg.content)
      .setTimestamp()
    tipoui.channels.get(PUB.tipoui.botsecret).send(embed)
      .then(() => TiCu.Log.Auto.DM(embed, msg))
  } else msg.reply("je ne parle qu'aux gens de Tipoui ♥")
}
