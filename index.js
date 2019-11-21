// Init
const CFG = require("./private.json")
const EXPRESS = require("express")
const DiscordNPM = require("discord.js")
const SequelizeDB = require("sequelize")
const EventsModule = require("events")
global.Server = EXPRESS()
global.DB = new SequelizeDB(CFG.sequelizeURL)
global.Discord = new DiscordNPM.Client()
global.Event = new EventsModule.EventEmitter()
global.PUB = require("./public.json");
global.TiCu = {
  Date : require("./exports/date.js"),
  Log : require("./exports/log.js")(),
  json : require("./exports/json.js"),
  Mention : require("./exports/mention.js"),
  Authorizations : require("./exports/authorizations.js"),
  VotesCollections : require("./exports/collections.js")(),
  DM : require("./exports/dm.js"),
  Quarantaine : require("./exports/quarantaine.js"),
  Parser : require("./exports/parser.js"),
  Commands : {
    quarantaine : require("./exports/commands/quarantaine.js")(),
    roles : require("./exports/commands/roles.js")(),
    send : require("./exports/commands/send.js")(),
    vote : require("./exports/commands/vote.js")()
  }
}

// Discord
Discord.login( CFG.discordToken )
Discord.once("ready", () => {
    global.tipoui = Discord.guilds.get(PUB.tipoui.commu)
    global.maxilog = Discord.channels.get(PUB.debug.maxilog)
    global.minilog = Discord.channels.get(PUB.debug.minilog)
    console.log(TiCu.Date("log") + " : Connexion à Discord.")
    maxilog.send(TiCu.Date("log") + " : Reconnexion.")
    minilog.send("Coucou, je suis de retour ♥")
    TiCu.VotesCollections.startup()
    Server.get(
      "/discord/invite",
      function(req, res) {
        Discord.channels.get(PUB.inviteChannel)
          .createInvite({maxUses : 1, maxAge : 300})
          .then(invite => {
            res.send(invite.url)
            TiCu.Log.ServerPage(req)
          }
        )
      }
    )
  })
Discord.on("message", (msg) => {
  if(msg.author.id != PUB.tipouitaculte && msg.author.id != PUB.licorne) {
    if(msg.channel.type === "dm" ) {
      let user = tipoui.members.get(msg.author.id) ? tipoui.members.get(msg.author.id) : false
      if(user) {
        let embed = new DiscordNPM.RichEmbed()
          .setColor(user.displayColor)
          .setAuthor(user.displayName, user.user.avatarURL, msg.url)
          .setDescription(msg.content)
          .setTimestamp()
        tipoui.channels.get(PUB.tipoui.botsecret).send(embed)
          .then(() => TiCu.Log.DM(embed, msg))
      } else msg.reply("je ne parle qu'aux gens de Tipoui ♥")
    } else if(msg.channel.id === PUB.tipoui.quarantaineUser || msg.channel.id === PUB.tipoui.quarantaineVigi) {
      if(msg.channel.id === PUB.tipoui.quarantaineUser) {
        let user = msg.member
        let embed = new DiscordNPM.RichEmbed()
          .setColor(user.displayColor)
          .setAuthor(user.displayName, user.user.avatarURL, msg.url)
          .setDescription(msg.content)
          .setTimestamp()
        tipoui.channels.get(PUB.tipoui.quarantaineVigi).send(embed)
          .then(newMsg => TiCu.Log.Quarantaine("reçu", newMsg, msg))
      } else if(msg.channel.id === PUB.tipoui.quarantaineVigi) {
        tipoui.channels.get(PUB.tipoui.quarantaineUser).send(msg.content)
          .then(newMsg => TiCu.Log.Quarantaine("envoyé", newMsg, msg))
      }
    } else if(msg.content.match(/^![a-zA-Z]/)) {
      let params = msg.content.substring(1).split(/\s+/)
      let cmd = params.shift().toLowerCase()
      TiCu.Commands[cmd] ? TiCu.Authorizations(cmd, msg) ? TiCu.Commands[cmd].run(params, msg) : TiCu.Log.Error(cmd, "permissions manquantes", msg) : msg.react("❓")
    }
  }
})
Discord.on("messageReactionAdd", (msg, usr) => {return})
Discord.on("messageReactionRemove", (msg, usr) => {return})
Discord.on("guildMemberAdd", usr => {
  if(usr.guild.id === tipoui.id) {
    maxilog.send(TiCu.Date("log") + " : Arrivée de membre\n" + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
    minilog.send("Arrivée de " + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
  } else return
})
Discord.on("guildMemberRemove", usr => {
  if(usr.guild.id === tipoui.id) {
    maxilog.send(TiCu.Date("log") + " : Départ de membre\n" + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
    minilog.send("Départ de " + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
  } else return
})
// Server
Server.listen(3000);
