// Init
const CFG = require( "./private.json" )
const EXPRESS = require("express")
const DiscordNPM = require( "discord.js" )
const SequelizeDB = require( "sequelize" )
global.PUB = require( "./public.json" )
global.DB = new SequelizeDB(CFG.sequelizeURL)
global.Discord = new DiscordNPM.Client()
global.Server = EXPRESS()
require('./exports/list.js')()
const frFR = {
    jour : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    mois : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],

}
// Discord
Discord.login( CFG.discordToken )
Discord.once(
    "ready", () => {
        console.log("TipouiTaCulte est connectée à Discord")
        // Send to Discord.guilds.get(PUB.tipoui.commu).channels.get(PUB.tipoui.minilog) && Discord.guilds.get(PUB.tipoui.commu).channels.get(PUB.tipoui.maxilog)
        TiCu.Send(PUB.debug.minilog, "Je suis de retour, pour votre plus grand plaisir !")
        TiCu.Send(PUB.debug.maxilog, TiCu.Date(plain) + ": Reconnexion de TipouiTaCulte")
        TiCu.Send(PUB.debug.maxilog, TiCu.Date(fr) + ": Reconnexion de TipouiTaCulte")
        TiCu.Send(PUB.debug.maxilog, TiCu.Date(frFR) + ": Reconnexion de TipouiTaCulte")
        TiCu.Server.AutoInvite()
    }
)
Discord.on(
    "message", (msg) => {
        return
    }
)
// Server
Server.listen(3000);