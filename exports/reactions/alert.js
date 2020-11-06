module.exports = {
  activated: true,
  methodName: 'alert',
  name : "Alerte",
  desc : "Lance une alerte",
  emoji: "🚩",
  authorizations : TiCu.Authorizations.getAuth("reaction", "alert"),
  run : function(reaction, usr, type) {
    if (type === "add") {
      TiCu.Alerte.dmMembers(reaction.message.channel.id, `Contenu du message : ${reaction.message.content}`, reaction.message.url)
      TiCu.Alerte.sendVigi(usr.id, reaction.message.channel.id, `Contenu du message : ${reaction.message.content}`, reaction.message.url)
      reaction.users.remove(usr.id)
    }
  }
}
