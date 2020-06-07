module.exports = {
  activated: true,
  methodName: 'merci',
  name : "Merci TTC",
  desc : "Merci TTC\n",
  schema: "merci TTC",
  trigger: /(Merci|thanks?\s*(you)?)\s+(ttc|tipouitaculte)/i,
  authorizations : TiCu.Authorizations.getAuth("auto", "monlevel"),
  run : function(msg) {
    msg.channel.send(`De rien ${msg.member.nickname ? msg.member.nickname : msg.member.user.username}`)
  }
}
