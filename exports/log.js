module.exports = function() {
  return {
    Error : function(cmd, err, msg) {
      if(cmd === "noCmd") {msg.react("❓")} else {
        msg.reply("erreur avec la commande `" + cmd + "` : " + err +".")
        maxilog.send(TiCuDate("log") + " : Erreur : (`" + cmd + "`, " + err +")")
      }
    },
    Send : function(msg) {
      maxilog.send(TiCuDate("log") + " : SendRoot \n" + msg.channel.toString() + "\n" + msg.url)
      maxilog.send(msg.content)
    },
    Auto : {
      Quarantaine : function(type, newMsg, msg) {
        maxilog.send(TiCuDate("log") + " : Quarantaine - " + type + "\n" + newMsg.url)
        msg.react("💬")
      },
      DM : function(embed, msg) {
        maxilog.send(TiCuDate("log") + " : DM")
        maxilog.send(embed)
        msg.react("💬")
      }
    },
    Prefixed : {
      Send : function(cmdMsg, newMsg) {
          let author = cmdMsg.member ? cmdMsg.member.displayName : cmdMsg.author.name
          maxilog.send(TiCuDate("log") + " : Send \n" + author + " a envoyé un message vers `" + newMsg.channel.toString() + "`\n" + newMsg.url)
          maxilog.send(newMsg.toString())
          minilog.send(author + " a envoyé un message vers `" + newMsg.channel.toString() + "`\n" + newMsg.url)
          cmdMsg.react("✅")
      },
      Roles : function(target, action, roles, msg) {
        let author = msg.member ? msg.member.displayName : msg.author.name
        let roleNames = ""
        for(i=0;i<roles.length;i++) {
          roleNames += "`" + tipoui.roles.get(roles[i]).name + "` "
        }
        action = (action === "addRoles") ? "ajoué" : "enlevé"
        minilog.send(author + " a " + action + " des rôles à " + target.displayName)
        maxilog.send(TiCuDate("log") + " : Roles\n" + author + " a " + action + " des rôles à " + target.displayName + "\n" + roleNames)
        msg.react("✅")
      }
    },
    ServerPage : function(req) {
      maxilog.send(TiCuDate("log") + " : Server\nServed Page : " + req)
    }
  }
}
