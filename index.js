// Init
const crypto = require('crypto');
const loader = require('./exports/loader')
loader.loadFull('./')

// Discord
Discord.login( CFG.discordToken )
Discord.once("ready", () => {
  global.tipoui = Discord.guilds.get(PUB.servers.commu)
  global.maxilog = Discord.channels.get(PUB.salons.maxiLog.id)
  global.minilog = Discord.channels.get(PUB.salons.miniLog.id)
  console.log(TiCu.Date("log") + " : Connexion à Discord.")
  if (!dev || (dev && devConfig)) {
    if (!dev) {
      maxilog.send(TiCu.Date("log") + " : Reconnexion.")
      minilog.send("Coucou, je suis de retour ♥")
    }

    if (!dev || (devConfig && devConfig.generic && devConfig.generic.voteStartup)) {
      TiCu.VotesCollections.Startup()
    }
    if (!dev || (devConfig && devConfig.server)) {
      Server.get(
        "/discord/invite/:key",
        function (req, res) {
          const hash = crypto.createHmac("sha256", CFG.expressSalt)
            .update(TiCu.Date("raw").toString().substr(0, 8))
            .digest("hex");
          if (activeInvite) {
            if (req.params.key === hash) {
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
            res.send("raid.php")
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
