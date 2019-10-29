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
        console.log("TipouiTaCulte est connectée à Discord")
        // Send to Discord.guilds.get(PUB.tipoui.commu).channels.get(PUB.tipoui.minilog) && Discord.guilds.get(PUB.tipoui.commu).channels.get(PUB.tipoui.maxilog)
        TiCu.Send(PUB.debug.minilog, "Je suis de retour, pour votre plus grand plaisir !")
        TiCu.Send(PUB.debug.bots, 
            "Raw: " + TiCuDate("raw") +
            "\nTime: " + TiCuDate("time") +
            "\nfr: " + TiCuDate("fr") +
            "\nfrDate: " + TiCuDate("frDate") +
            "\nfrDateTime: " + TiCuDate("frDateTime") +
            "\nLog: " + TiCuDate("log") +
            "\nStuff: " + TiCuDate("stuff")
            )
        TiCu.Server.AutoInvite()
    }
)
Discord.on(
    "message", (msg) => {
        return
    }
)

// Log
Event.on(
    "send", (target, content) => {
        TiCu.Log.Send(target, content)
    }
)
// Server
Server.listen(3000);