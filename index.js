// Init
const loader = require('./exports/loader')
loader.loadFull('./')

const fakeLog = {
  send: function (message) {
    console.log(message)
  }
}

function createLogger(type, server) {
  if (server[type] && server[type] !== "") {
    global[type][server.id] = Discord.channels.get(dev ? PUB.salons.logsDev.id : server[type])
  } else {
    global[type][server.id] = fakeLog
  }
}

// Discord
Discord.login( CFG.discordToken )
Discord.once("ready", () => {
  global.tipoui = Discord.guilds.get(PUB.servers.commu.id)
  global.maxilog = []
  global.minilog = []
  for (const server of Object.values(PUB.servers)) {
    createLogger("maxilog", server)
    createLogger("minilog", server)
  }
  console.log(TiCu.Date("log") + " : Connexion à Discord.")
  loader.updateSalonsName()
  if (!dev || (dev && devConfig)) {
    if (!dev) {
      maxilog[PUB.servers.commu.id].send(TiCu.Date("log") + " : Reconnexion.")
      minilog[PUB.servers.commu.id].send("Coucou, je suis de retour ♥")
    }

    if (!dev || (devConfig && devConfig.generic && devConfig.generic.voteStartup)) {
      TiCu.VotesCollections.Startup()
    }
    if (!dev || (devConfig && devConfig.generic && devConfig.generic.census)) {
      TiCu.Census.initCensus()
    }
    if (!dev || (devConfig && devConfig.generic && devConfig.generic.autoRoles)) {
      const messageForRolesId = "578295166742560768"
      const emojisRoles = {
        "📹" : "notifyoutube",
        "🎥" : "notiftwitch",
        "🐝" : "espritruche",
        "📜" : "notifactu",
        "🎉" : "notifevent"
      }
      tipoui.channels.get(PUB.salons.rolessalons.id).fetchMessage(messageForRolesId).then(msg => {
        msg.createReactionCollector((reaction, user) => {return (!user.bot) && (Object.keys(emojisRoles).includes(reaction.emoji.name))})
          .on(
            "collect",
            reaction => {
              for (const user of reaction.users.array()) {
                if (!user.bot) {
                  const member = tipoui.members.get(user.id)
                  const askedRoleId = PUB.roles[emojisRoles[reaction.emoji.name]].id
                  if (member.roles.keyArray().includes(askedRoleId)) {
                    member.removeRole(askedRoleId)
                    TiCu.Log.AutoRole(member, emojisRoles[reaction.emoji.name], "remove")
                  } else {
                    member.addRole(askedRoleId)
                    TiCu.Log.AutoRole(member, emojisRoles[reaction.emoji.name], "add")
                  }
                  reaction.remove(user.id)
                }
              }
            }
          )
      })
    }
    if (!dev || (devConfig && devConfig.server)) {
      Server.get(
        "/discord/invite/:key",
        function (req, res) {
          const hashedDate = hash(TiCu.Date("raw").toString().substr(0, 8))
          if (activeInvite) {
            if (req.params.key === hashedDate) {
              Discord.channels.get(PUB.salons.invite.id)
                .createInvite({maxUses: 1, maxAge: 300})
                .then(invite => {
                    res.send(invite.url)
                    TiCu.Log.ServerPage(req)
                  }
                )
            } else {
              res.send("https://www.youtube.com/watch?v=BAHtStfZZWg")
            }
          } else {
            res.send("https://tipoui.me/discord/raid.php")
          }
        }
      )
    }
  }
})

if (!dev || (dev && devConfig)) {
  if (!dev || (devConfig.parsing && devConfig.parsing.message)) {
    Discord.on("message", (msg) => {
      parseMessage(msg)
    })
  }

  if (!dev || (devConfig.parsing && devConfig.parsing.messageDelete)) {
    Discord.on("messageDelete", (msg) => {
      parseMessageDelete(msg)
    })
  }

  if (!dev || (devConfig.parsing && devConfig.parsing.messageUpdate)) {
    Discord.on("messageUpdate", (oldMsg, newMsg) => {
      parseMessageUpdate(oldMsg, newMsg)
    })
  }

  if (!dev || (devConfig.parsing && devConfig.parsing.messageReactionAdd)) {
    Discord.on("messageReactionAdd", (reaction, usr) => {
      parseReaction(reaction, usr, "add")
    })
  }

  if (!dev || (devConfig.parsing && devConfig.parsing.messageReactionRemove)) {
    Discord.on("messageReactionRemove", (reaction, usr) => {
      parseReaction(reaction, usr, "remove")
    })
  }

  if (!dev || (devConfig.parsing && devConfig.parsing.guildMemberAdd)) {
    Discord.on("guildMemberAdd", usr => {
      parseGuildMemberAdd(usr)
    })
  }

  if (!dev || (devConfig.parsing && devConfig.parsing.guildMemberRemove)) {
    Discord.on("guildMemberRemove", usr => {
      parseGuildMemberRemove(usr)
    })
  }

  if (!dev || (devConfig.parsing && devConfig.parsing.guildMemberUpdate)) {
    Discord.on("guildMemberUpdate", (oldUsr, newUsr) => {
      parseGuildMemberUpdate(oldUsr, newUsr)
    })
  }

  // Server
  if (!dev || (devConfig && devConfig.server)) {
    Server.listen(3000);
  }
}
