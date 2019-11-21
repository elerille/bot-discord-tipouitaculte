module.exports = function() {
  return {
    Error : function(cmd, err, msg) {
      if(cmd === "vote") {
        msg.channel.send("Erreur avec la commande `" + cmd + "` : " + err +".")
          .then(newMsg => {
            msg.delete()
            newMsg.delete(10000)
          })
        maxilog.send(TiCu.Date("log") + " : Erreur : (`" + cmd + "`, " + err +")")
      } else {
        msg.reply("erreur avec la commande `" + cmd + "` : " + err +".")
        maxilog.send(TiCu.Date("log") + " : Erreur : (`" + cmd + "`, " + err +")")
      }
    },
    Json : function(type, target) {
      if(type === "err") maxilog.send(TiCu.Date("log") + " : JSON\nErreur JSON (" + target + ")")
      else maxilog.send(TiCu.Date("log") + " : JSON\n" + type + " - " + target)
    },
    Quarantaine : function(type, newMsg, msg) {
      maxilog.send(TiCu.Date("log") + " : Quarantaine - " + type + "\n" + newMsg.url)
      msg.react("💬")
    },
    DM : function(embed, msg) {
      maxilog.send(TiCu.Date("log") + " : DM")
      maxilog.send(embed)
      msg.react("💬")
    },
    ServerPage : function(req) {
      maxilog.send(TiCu.Date("log") + " : Server\nServed Page : " + req)
    },
    Commands : {
      Send : function(cmdMsg, newMsg) {
          let author = cmdMsg.member ? cmdMsg.member.displayName : cmdMsg.author.name
          maxilog.send(TiCu.Date("log") + " : Send \n" + author + " a envoyé un message vers `" + newMsg.channel.toString() + "`\n" + newMsg.url)
          maxilog.send(newMsg.toString())
          minilog.send(author + " a envoyé un message vers " + newMsg.channel.toString())
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
        maxilog.send(TiCu.Date("log") + " : Roles\n" + author + " a " + action + " des rôles à " + target.displayName + "\n" + roleNames)
        msg.react("✅")
      },
      Quarantaine : function(action, target, reason, msg) {
        let author = msg.member ? msg.member.displayName : msg.author.name
        if(action) {
          minilog.send(msg.member.displayName + "a mis " + target.displayName + " en quarantaine.")
          maxilog.send(TiCu.Date("log") + " : Quarantaine\n" + msg.member.displayName + " a mis " + target.displayName + " en quarantaine.")
          msg.react("✅")
        } else {
          minilog.send(msg.member.displayName + "a enlevé " + target.displayName + " de quarantaine.")
          maxilog.send(TiCu.Date("log") + " : Quarantaine\n" + msg.member.displayName + " a enlevé " + target.displayName + " de quarantaine.")
          msg.react("✅")
        }
        if(reason) {
          minilog.send("Raison : " + reason)
          maxilog.send("Raison : " + reason)
        }
      },
      Vote : {
        Public : function(msg) {
          minilog.send(msg.member.displayName + " a lancé un vote public")
          maxilog.send(TiCu.Date("log") + " : Vote\n" + msg.member.displayName + " a lancé un vote public :\n" + msg.url)
          maxilog.send(msg.content)
        },
        Anon : function(type, params, newMsg, msg) {
          /* Might receive empty params[2] */
          if(type === "text") {
            minilog.send(msg.member.displayName + " a lancé un vote anonyme")
          } else {
            minilog.send(msg.member.displayName + " a lancé un vote anonyme pour " + type + " " + TiCu.Mention(params[2]) )
            maxilog.send(TiCu.Date("log") + " : Vote\n" + msg.member.displayName + " a lancé un vote anonyme : " + type + TiCu.Mention(params[2]) + "\n" + msg.url)
          }
          maxilog.send(newMsg.content)
          msg.delete()
        }
      }
    }
  }
}
