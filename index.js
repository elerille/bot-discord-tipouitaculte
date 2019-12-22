// Init
const CFG = require("./private.json")
const EXPRESS = require("express")
const DiscordNPM = require("discord.js")
const EventsModule = require("events")
global.Server = EXPRESS()
global.SequelizeDB = require("sequelize")
global.DB = new SequelizeDB(CFG.sequelizeURL)
global.Discord = new DiscordNPM.Client({disabledEvents: ['TYPING_START']})
global.Event = new EventsModule.EventEmitter()
global.PUB = require("./public.json");
global.VotesFile = "private/votes.json";
global.VotesEmojis = ["✅","⚪","🛑","⏱"];
global.TiCu = {
  Date : require("./exports/date.js"),
  Log : require("./exports/log.js"),
  json : require("./exports/json.js"),
  Xp : require("./exports/xp.js"),
  Mention : require("./exports/mention.js"),
  Authorizations : require("./exports/authorizations.js"),
  VotesCollections : require("./exports/voteCollections.js"),
  Commands : {
    ban : require("./exports/commands/ban.js"),
    bienvenue : require("./exports/commands/bienvenue.js"),
    color: require("./exports/commands/color.js"),
    help : require("./exports/commands/help.js"),
    kick : require("./exports/commands/kick.js"),
    list : require("./exports/commands/list.js"),
    purifier : require("./exports/commands/purifier.js"),
    quarantaine : require("./exports/commands/quarantaine.js"),
    roles : require("./exports/commands/roles.js"),
    send : require("./exports/commands/send.js"),
    vote : require("./exports/commands/vote.js"),
    level : require("./exports/commands/level.js"),
    xpstatus : require("./exports/commands/xpstatus.js"),
    xp : require("./exports/commands/xp.js")
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
    global.maxilog = Discord.channels.get(PUB.tipoui.maxilog)
    global.minilog = Discord.channels.get(PUB.tipoui.minilog)
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

function createEmbedCopy(msg, user, edited = false, previousContent) {
  let embed = new DiscordNPM.RichEmbed()
    .setColor(user.displayColor)
    .setAuthor(user.displayName, user.user.avatarURL, msg.url)
    .setDescription(edited ? previousContent : msg.content)
    .setTimestamp()
  if (edited) {
    embed.addField("Message édité", msg.content)
  }
  if(msg.attachments) {
    let attachments = Array.from(msg.attachments.values())
    for(let i=0;i<attachments.length;i++){
      embed.addField("Pièce-jointe URL #" + i, attachments[i].url)
      embed.addField("Pièce-jointe ProxyURL #" + i, attachments[i].proxyURL)
    }
  }
  return embed
}

function retrieveMessageForEdit(originMsg, channel) {
  return tipoui.channels.get(channel).messages.find(
    msg => msg.author.bot && msg.embeds && msg.embeds[0].author.url === originMsg.url
  )
}

Discord.on("message", (msg) => {
  if(msg.author.id !== PUB.tipouitaculte && msg.author.id !== PUB.licorne) {
    TiCu.Xp.processXpFromMessage('add', msg)
    if(msg.channel.type === "dm" ) {
      let user = tipoui.members.get(msg.author.id) ? tipoui.members.get(msg.author.id) : undefined
      if(user) {
        if(!user.roles.find(e => e === PUB.tipoui.quarantaineRole)) {
          let embed = createEmbedCopy(msg, user)
          tipoui.channels.get(PUB.tipoui.botsecret).send(embed)
            .then(() => TiCu.Log.DM(embed, msg))
        } else msg.reply("utilise plutôt <#" + PUB.tipoui.quarantaineUser + "> s'il te plaît. Ce message n'a pas été transmis.")
      } else msg.reply("je ne parle qu'aux gens de Tipoui ♥")
    } else if(msg.channel.id === PUB.tipoui.quarantaineUser || msg.channel.id === PUB.tipoui.quarantaineVigi) {
      if(msg.channel.id === PUB.tipoui.quarantaineUser) {
        let user = msg.member
        tipoui.channels.get(PUB.tipoui.quarantaineVigi).send(createEmbedCopy(msg, user))
          .then(newMsg => TiCu.Log.Quarantaine("reçu", newMsg, msg))
      } else if(msg.channel.id === PUB.tipoui.quarantaineVigi) {
        tipoui.channels.get(PUB.tipoui.quarantaineUser).send(msg.content)
          .then(newMsg => TiCu.Log.Quarantaine("envoyé", newMsg, msg))
      }
    } else if(msg.content.match(/^![a-zA-Z]/)) {
      let params = []
      msg.content.substring(1).split(/\s+/).forEach(value => {
        params.push(value.toLowerCase())
      })
      let cmd = params.shift()
      TiCu.Commands[cmd] ? TiCu.Authorizations.Command(cmd, msg) ? TiCu.Commands[cmd].run(params, msg) : TiCu.Log.Error(cmd, "permissions manquantes", msg) : msg.react("❓")
    } else {
      parseForAutoCommands(msg)
    }
  }
})

Discord.on("messageDelete", (msg) => {
  if(msg.author.id !== PUB.tipouitaculte && msg.author.id !== PUB.licorne) {
    TiCu.Xp.processXpFromMessage('remove', msg)
  }
})

Discord.on("messageUpdate", (oldMsg, newMsg) => {
  if(oldMsg.author.id !== PUB.tipouitaculte && oldMsg.author.id !== PUB.licorne) {
    TiCu.Xp.processXpMessageUpdate(oldMsg, newMsg)
    if(newMsg.channel.type === "dm" ) {
      let user = tipoui.members.get(newMsg.author.id) ? tipoui.members.get(newMsg.author.id) : undefined
      if(user) {
        if(!user.roles.find(e => e === PUB.tipoui.quarantaineRole)) {
          const previousBotEmbed = retrieveMessageForEdit(oldMsg, PUB.tipoui.botsecret)
          if (previousBotEmbed) {
            let embed = createEmbedCopy(newMsg, user, true, previousBotEmbed.embeds[0].description)
            previousBotEmbed.edit(embed).then(() => TiCu.Log.UpdatedDM(embed, newMsg))
          } else TiCu.Log.UpdatedDM(undefined, newMsg, 'Could not find previous bot message to update')
        }
      }
    } else if(newMsg.channel.id === PUB.tipoui.quarantaineUser || newMsg.channel.id === PUB.tipoui.quarantaineVigi) {
      if (newMsg.channel.id === PUB.tipoui.quarantaineUser) {
        const previousBotEmbed = retrieveMessageForEdit(oldMsg, PUB.tipoui.quarantaineVigi)
        if (previousBotEmbed) {
          let embed = createEmbedCopy(newMsg, newMsg.member, true, previousBotEmbed.embeds[0].description)
          previousBotEmbed.edit(embed).then(msgEdited => TiCu.Log.UpdatedQuarantaine("reçu", msgEdited, newMsg))
        } else TiCu.Log.UpdatedQuarantaine("reçu", undefined, newMsg, 'Could not find previous bot message to update')
      } else if(newMsg.channel.id === PUB.tipoui.quarantaineVigi) {
        const previousBotEmbed = retrieveMessageForEdit(oldMsg, PUB.tipoui.quarantaineUser)
        if (previousBotEmbed) {
          let embed = createEmbedCopy(newMsg, newMsg.member, true, previousBotEmbed.embeds[0].description)
          previousBotEmbed.edit(embed).then(msgEdited => TiCu.Log.UpdatedQuarantaine("envoyé", msgEdited, newMsg))
        } else TiCu.Log.UpdatedQuarantaine("envoyé", undefined, newMsg, 'Could not find previous bot message to update')
      }
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
  if (!usr.bot && !reaction.message.author.bot) {
    TiCu.Xp.reactionXp(type, reaction, usr)
    let found = false
    for (const reactionFunction of Object.values(TiCu.Reactions)) {
      if (reaction.emoji.name === reactionFunction.emoji) {
        if (TiCu.Authorizations.Reaction(reactionFunction, reaction, usr)) {
          reactionFunction.run(reaction, usr, type)
        } else TiCu.Log.ReactionError(reaction, usr, type)
        found = true
      }
    }
    /* if (!found) TiCu.Log.Reactions.genericReaction(reaction, usr, type) */
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
    tipoui.channels.get(PUB.tipoui.genTP).send("Oh ! Bienvenue <@" + usr.id + "> ! Je te laisse lire les Saintes Règles, rajouter tes pronoms dans ton pseudo et nous faire une ptite présentation dans le salon qui va bien :heart:\nSi tu n'as pas fait vérifier ton numéro de téléphone ou d'abonnement Nitro, il va aussi te falloir aussi attendre 10 petites minutes que Discord s'assure tu n'es pas une sorte d'ordinateur mutant venu de l'espace... Même si en vrai ça serait trop cool quand même !")
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
    newUsr.addRole(PUB.tipoui.votesRole)
    tipoui.channels.get(PUB.tipoui.genTutu).send("Bienvenue parmi les 💠Turquoises <@" + newUsr.id + "> ! <:turquoise_heart:417784485724028938>\nTu as désormais accès à de nouveaux salons, notamment <#453706061031931905> où tu pourras découvrir les spécificités de cette promotion. Par ailleurs, n'hésite pas à consulter <#453702956315836436> pour voir les rôles auxquels tu peux prétendre, et demande-les-moi par message privé.")
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
