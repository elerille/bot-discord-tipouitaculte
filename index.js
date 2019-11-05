// Init
const CFG = require( "./private.json" )
const EXPRESS = require("express")
const DiscordNPM = require( "discord.js" )
const SequelizeDB = require( "sequelize" )
const EventsModule = require( "events" )
global.Server = EXPRESS()
global.DB = new SequelizeDB(CFG.sequelizeURL)
global.Discord = new DiscordNPM.Client()
global.Event = new EventsModule.EventEmitter()
global.PUB = require( "./public.json" )
global.TiCuDate
require('./exports/list.js')()
// Discord
Discord.login( CFG.discordToken )
Discord.once(
  "ready", () => {
    global.tipoui = Discord.guilds.get(PUB.tipoui.commu)
    global.maxilog = Discord.channels.get(PUB.debug.maxilog)
    global.minilog = Discord.channels.get(PUB.debug.minilog)
    console.log(TiCuDate("log") + " : Connexion à Discord.")
    maxilog.send(TiCuDate("log") + " : Reconnexion.")
    minilog.send("Coucou, je suis de retour ♥")
    TiCu.Server.AutoInvite()
  }
)
Discord.on(
  "message", (msg) => {
    (msg.author.id != PUB.tipouitaculte && msg.author.id != PUB.licorne) ? TiCu.Parser(msg) : null
  }
)

// Server
Server.listen(3000);

// Log
Event
  .on(
    "error", (command, error, msg) => {
      TiCu.Log.Error(command, error, msg)
    }
  )
  .on(
    "send", (target, content) => {
      TiCu.Log.Send(target, content)
    }
  )
  .on(
  "serverPage", (req) => {
    TiCu.Log.ServerPage(req)
  }
)
