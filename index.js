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
    global[type][server.id] = Discord.channels.resolve(dev ? PUB.salons.logsDev.id : server[type])
  } else {
    global[type][server.id] = fakeLog
  }
}

// Discord
Discord.login( CFG.discordToken )
Discord.once("ready", () => {
  global.tipoui = Discord.guilds.resolve(PUB.servers.commu.id)
  global.vigi = Discord.guilds.resolve(PUB.servers.vigi.id)
  global.cdc = Discord.guilds.resolve(PUB.servers.cdc.id)

  global.maxilog = []
  global.minilog = []
  for (const server of Object.values(PUB.servers)) {
    createLogger("maxilog", server)
    createLogger("minilog", server)
  }
  console.log(TiCu.Date("log") + " : Connexion à Discord.")
  loader.updateSalonsName()
  global.games = {}
  loader.launchGames()
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
      const messageForRolesId = "831134956205506570"
      const messageForExistransinterId = "759347410529943562"
      const emojisRoles = {
        "📹" : "notifyoutube",
        "🎥" : "notiftwitch",
        "🐝" : "espritruche",
        "📜" : "notifactu",
        "🎉" : "notifevent",
        "🍑" : "notifnudes",
        "🐸" : "grenouille",
        "frogangel2" : "grenouille-turquoise"
      }
      tipoui.channels.resolve(PUB.salons.rolessalons.id).messages.fetch(messageForRolesId).then(msg => {
        msg.createReactionCollector((reaction, user) => {return (!user.bot) && (Object.keys(emojisRoles).includes(reaction.emoji.name))})
          .on(
            "collect",
            reaction => {
              for (const user of reaction.users.cache.array()) {
                if (!user.bot) {
                  const member = tipoui.members.resolve(user.id)
                  const askedRoleId = PUB.roles[emojisRoles[reaction.emoji.name]].id
                  if (askedRoleId !== PUB.roles["grenouille-turquoise"].id || member.roles.cache.keyArray().includes(PUB.roles.turquoise.id)) {
                    if (member.roles.cache.keyArray().includes(askedRoleId)) {
                      member.roles.remove(askedRoleId)
                      TiCu.Log.AutoRole(member, emojisRoles[reaction.emoji.name], "remove")
                    } else {
                      member.roles.add(askedRoleId)
                      TiCu.Log.AutoRole(member, emojisRoles[reaction.emoji.name], "add")
                    }
                  }
                  reaction.users.remove(user.id)
                }
              }
            }
          )
      })
      tipoui.channels.resolve(PUB.salons.rolessalons.id).messages.fetch(messageForExistransinterId).then(msg => {
        msg.createReactionCollector((reaction, user) => {return (!user.bot) && (["❌", "✅"].includes(reaction.emoji.name))})
          .on(
            "collect",
            reaction => {
              for (const user of reaction.users.cache.array()) {
                if (!user.bot) {
                  const member = tipoui.members.resolve(user.id)
                  const askedRoleId = PUB.roles.notifexistransinter.id
                  if (member.roles.cache.keyArray().includes(askedRoleId) && reaction.emoji.name === "❌") {
                    member.roles.remove(askedRoleId)
                    TiCu.Log.AutoRole(member, "notifexistransinter", "remove")
                  } else if (!member.roles.cache.keyArray().includes(askedRoleId) && reaction.emoji.name === "✅") {
                    member.roles.add(askedRoleId)
                    TiCu.Log.AutoRole(member, "notifexistransinter", "add")
                  }
                  reaction.users.remove(user.id)
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
              Discord.channels.resolve(PUB.salons.invite.id)
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
