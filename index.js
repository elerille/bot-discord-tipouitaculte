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
global.VotesFile = "private/votes.json";
global.VotesEmojis = ["✅","⚪","🛑","⏱"];
global.TiCu = {
  Date : require("./exports/date.js"),
  Log : require("./exports/log.js"),
  json : require("./exports/json.js"),
  Mention : require("./exports/mention.js"),
  Authorizations : require("./exports/authorizations.js"),
  VotesCollections : require("./exports/voteCollections.js"),
  Commands : {
    help : require("./exports/commands/help.js"),
    quarantaine : require("./exports/commands/quarantaine.js"),
    roles : require("./exports/commands/roles.js"),
    send : require("./exports/commands/send.js"),
    vote : require("./exports/commands/vote.js"),
    color: require("./exports/commands/color.js")
  },
  Reactions : {
    heart : require("./exports/reactions/heart.js")
  },
  Auto : {
    suchTruc : require("./exports/auto/suchTruc.js")
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
    TiCu.VotesCollections.Startup()
    Server.get(
      "/discord/invite",
      function(req, res) {
        Discord.channels.get(PUB.tipoui.invite)
          .createInvite({maxUses : 1, maxAge : 300})
          .then(invite => {
            res.send(invite.url)
            TiCu.Log.ServerPage(req)
          }
        )
      }
    )
  })

function parseForAutoCommands(msg) {
  for (const autoCommand of Object.values(TiCu.Auto)) {
    if (msg.content.indexOf(autoCommand.trigger) !== -1 && TiCu.Authorizations.Auto(autoCommand, msg)) {
      autoCommand.run(msg)
    }
  }
}

Discord.on("message", (msg) => {
  if(msg.author.id !== PUB.tipouitaculte && msg.author.id !== PUB.licorne) {
    if(msg.channel.type === "dm" ) {
      let user = tipoui.members.get(msg.author.id) ? tipoui.members.get(msg.author.id) : undefined
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
      TiCu.Commands[cmd] ? TiCu.Authorizations.Command(cmd, msg) ? TiCu.Commands[cmd].run(params, msg) : TiCu.Log.Error(cmd, "permissions manquantes", msg) : msg.react("❓")
    } else {
      parseForAutoCommands(msg)
    }
  }
})

/**
 * Find the right reaction response and run the relevant command
 * @param reaction MessageReaction
 * @param usr User
 * @param type "add" | "remove"
 */
function parseReaction(reaction, usr, type) {
  if (!usr.bot) {
    let found = false
    for (const reactionFunction of Object.values(TiCu.Reactions)) {
      if (reaction.emoji.name === reactionFunction.emoji) {
        if (TiCu.Authorizations.Reaction(reactionFunction, reaction, usr)) {
          reactionFunction.run(reaction, usr, type)
        } else TiCu.Log.ReactionError(reaction, usr, type)
        found = true
      }
    }
    if (!found) TiCu.Log.Reactions.genericReaction(reaction, usr, type)
  }
}

Discord.on("messageReactionAdd", (reaction, usr) => {
  parseReaction(reaction, usr, "add")
})
Discord.on("messageReactionRemove", (reaction, usr) => {
  parseReaction(reaction, usr, "remove")
})
Discord.on("guildMemberAdd", usr => {
  if(usr.guild.id === tipoui.id) {
    maxilog.send(TiCu.Date("log") + " : Arrivée de membre\n" + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
    minilog.send("Arrivée de " + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
  }
})
Discord.on("guildMemberRemove", usr => {
  if(usr.guild.id === tipoui.id) {
    maxilog.send(TiCu.Date("log") + " : Départ de membre\n" + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
    minilog.send("Départ de " + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
  }
})
Discord.on("guildMemberUpdate", (oldUsr, newUsr) => {
  if(newUsr.roles.get(PUB.tipoui.turquoise) && !oldUsr.roles.get(PUB.tipoui.turquoise)) {
    newUsr.addRole(PUB.tipoui.turquoiseColor)
  }
  if(newUsr.roles.get(PUB.tipoui.luxure)) {
    if(!newUsr.roles.get(PUB.tipoui.hammer) && newUsr.roles.get(PUB.tipoui.demolisseureuse)) {newUsr.addRole(PUB.tipoui.hammer)}
    else if(newUsr.roles.get(PUB.tipoui.hammer) && !newUsr.roles.get(PUB.tipoui.demolisseureuse)) {newUsr.removeRole(PUB.tipoui.hammer)}
    if(!newUsr.roles.get(PUB.tipoui.naughty) && newUsr.roles.get(PUB.tipoui.grrrrl)) {newUsr.addRole(PUB.tipoui.naughty)}
    else if(newUsr.roles.get(PUB.tipoui.naughty) && !newUsr.roles.get(PUB.tipoui.grrrrl)) {newUsr.removeRole(PUB.tipoui.naughty)}
  } else if(oldUsr.roles.get(PUB.tipoui.luxure) && !newUsr.roles.get(PUB.tipoui.luxure)) {
    if(newUsr.roles.get(PUB.tipoui.hammer)) {newUsr.removeRole(PUB.tipoui.hammer)}
    if(newUsr.roles.get(PUB.tipoui.naughty)) {newUsr.removeRole(PUB.tipoui.naughty)}
  }
})

// Server
Server.listen(3000);
