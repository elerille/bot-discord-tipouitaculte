const DiscordNPM = require("discord.js")
module.exports = function(msg) {
  if(msg.channel.id === PUB.tipoui.quarantaineUser) {
    let user = msg.member
    let embed = new DiscordNPM.RichEmbed()
      .setColor(user.displayColor)
      .setAuthor(user.displayName, user.user.avatarURL, msg.url)
      .setDescription(msg.content)
      .setTimestamp()
    tipoui.channels.get(PUB.tipoui.quarantaineVigi).send(embed)
      .then(newMsg => TiCu.Log.Auto.Quarantaine("reçu", newMsg, msg))
  } else if(msg.channel.id === PUB.tipoui.quarantaineVigi) {
    tipoui.channels.get(PUB.tipoui.quarantaineUser).send(msg.content)
      .then(newMsg => TiCu.Log.Auto.Quarantaine("envoyé", newMsg, msg))
  }
}
