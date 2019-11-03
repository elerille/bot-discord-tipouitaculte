module.exports = function() {
  return {
    Error : function(cmd, err, msg) {
      err === "noCmd" ? msg.reply("je ne connais pas cette fonction.") :
      msg.reply("Erreur avec la commande `" + cmd + "` : " err +".")
      Discord.channels.get(PUB.debug.maxilog).send(TiCuDate("log") + " : Erreur : (`" + cmd + "`, " + err +")")
    },
    Send : function(msg) {
      Discord.channels.get(PUB.debug.maxilog).send(TiCuDate("log") + " : Send \n" + msg.channel.toString() + "\n" + msg.url)
      Discord.channels.get(PUB.debug.maxilog).send(msg.toString())
      Discord.channels.get(PUB.debug.minilog).send("Message envoyé : \n" + msg.url)
    },
    ServerPage : function(req) {
      Discord.channels.get(PUB.debug.maxilog).send(TiCuDate("log") + " : Server\nServed Page : " + req)
    }
  }
}
