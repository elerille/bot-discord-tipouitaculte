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
    maxilog.send(TiCu.Date("log") + " : Reconnexion.")
    minilog.send("Coucou, je suis de retour ♥")
    TiCu.VotesCollections.Startup()
    Server.get(
      "/discord/invite/:key",
      function(req, res) {
        const hash = crypto.createHmac('sha256', CFG.expressSalt)
          .update(TiCu.Date("raw").toString().substr(0,8))
          .digest('hex');
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
            res.send("You should not try to overthink us")
          }
        } else {
          res.send("Raid ongoing, no invite creation at the moment")
        }
      }
    )
  })

Discord.on("message", (msg) => {
  parseMessage(msg)
})

Discord.on("messageDelete", (msg) => {
  parseMessageDelete(msg)
})

Discord.on("messageUpdate", (oldMsg, newMsg) => {
  parseMessageUpdate(oldMsg, newMsg)
})

Discord.on("messageReactionAdd", (reaction, usr) => {
  parseReaction(reaction, usr, "add")
})

Discord.on("messageReactionRemove", (reaction, usr) => {
  parseReaction(reaction, usr, "remove")
})

Discord.on("guildMemberAdd", usr => {
  parseGuildMemberAdd(usr)
})

Discord.on("guildMemberRemove", usr => {
  parseGuildMemberRemove(usr)
})

Discord.on("guildMemberUpdate", (oldUsr, newUsr) => {
  parseGuildMemberUpdate(oldUsr, newUsr)
})

// Server
Server.listen(3000);
