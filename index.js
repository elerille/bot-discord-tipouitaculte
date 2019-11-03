// Init
const CFG = require( "./private.json" )
const EXPRESS = require("express")
const DiscordNPM = require( "discord.js" )
const SequelizeDB = require( "sequelize" )
const EventsModule = require( "events" )
global.PUB = require( "./public.json" )
global.DB = new SequelizeDB(CFG.sequelizeURL)
global.Discord = new DiscordNPM.Client()
global.Event = new EventsModule.EventEmitter()
global.Server = EXPRESS()
global.TiCuDate
require('./exports/list.js')()
// Discord
Discord.login( CFG.discordToken )
Discord.once(
  "ready", () => {
    console.log(TiCuDate("log") + " : Connexion à Discord.")
    Discord.guilds.get(PUB.debug.maxilog).send(TiCuDate("log") + " : Reconnexion.")
    Discord.guilds.get(PUB.debug.minilog).send("Coucou, je suis de retour ♥")
    TiCu.Server.AutoInvite()
  }
)
Discord.on(
  "message", (msg) => {
    msg.author.id != PUB.tipouitaculte ? TiCu.Parser(msg) : null
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
