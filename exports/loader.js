// Init
const EXPRESS = require("express")
const EventsModule = require("events")
const fs = require("fs");
const cron = require('node-cron')

function hook_stream(stream, callback) {
  const old_write = stream.write

  stream.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(stream, arguments)  // comments this line if you don't want output in the console
      callback(string, encoding, fd)
    }
  })(stream.write)

  return function() {
    stream.write = old_write
  }
}

function hookConsoleLog(first) {
  if (!first) {
    unhook_stdout()
    unhook_stderr()
  }
  const fileName = `./logs/${require("dateformat")(Date(), "yyyy-mm-dd-HH-MM-ss")}.log`
  const log_file = require('fs').createWriteStream(fileName, {flags : 'a'})
  global.unhook_stdout = hook_stream(process.stdout, function(string, encoding, fd) {
    log_file.write(string, encoding)
  })

  global.unhook_stderr = hook_stream(process.stderr, function(string, encoding, fd) {
    log_file.write(string, encoding)
  })
}

function parseForAutoCommands(msg) {
  for (const autoCommand of Object.values(TiCu.Auto)) {
    if (!!msg.content.match(autoCommand.trigger) && TiCu.Authorizations.Auto(autoCommand, msg)) {
      autoCommand.run(msg)
    }
  }
}

function createEmbedCopy(msg, user, edited = false, previousContent) {
  let embed = new DiscordNPM.RichEmbed()
    .setColor(user.displayColor)
    .setAuthor(user.displayName, user.user.avatarURL, msg.url)
    .setDescription(edited ? previousContent : msg.content)
    .addField("Utilisateurice", `<@${user.id}>`)
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

module.exports = {
  loadFull: function(rootPath) {
    this.loadInit()
    this.loadTicu(rootPath)
    this.loadParsing()
  },
  loadInit: function() {
    hookConsoleLog(true)
    cron.schedule("0 0 0 * * *", () => {
      hookConsoleLog(false)
    })
    global.CFG = require("../private.json")
    global.Server = EXPRESS()
    global.SequelizeDB = require("sequelize")
    global.DB = new SequelizeDB(CFG.sequelizeURL, {logging: false})
    global.DiscordNPM = require("discord.js")
    global.Discord = new DiscordNPM.Client({disabledEvents: ["TYPING_START"]})
    global.Event = new EventsModule.EventEmitter()
    global.VotesFile = "private/votes.json";
    global.VotesEmojis = ["✅","⚪","🛑","⏱"];
    global.activeInvite = true
    global.colorHexa = new RegExp(/^#[\da-f]{6}$/)
  },
  loadTicu: function(rootPath) {
    global.PUB = require("../public.json");
    global.TiCu = {
      Date : require("../exports/date.js"),
      Log : require("../exports/log.js"),
      json : require("../exports/json.js"),
      Xp : require("../exports/xp.js"),
      Mention : require("../exports/mention.js"),
      Authorizations : require("../exports/authorizations.js"),
      VotesCollections : require("../exports/voteCollections.js"),
      Categories : require("../exports/categories.js"),
      Channels : require("../exports/channels.js"),
      Vote : require("../exports/vote.js"),
      Profil : require("../exports/profil.js"),
      Commands : {},
      Reactions : {},
      Auto : {}
    }

    const commandFiles = fs.readdirSync(rootPath + "exports/commands/");
    for (const command of commandFiles) {
      const aux = require("../exports/commands/" + command)
      if (aux.alias && aux.activated) {
        for (const aliasCmd of aux.alias) {
          TiCu.Commands[aliasCmd] = aux
        }
      }
    }

    const reactionFiles = fs.readdirSync(rootPath + "exports/reactions/");
    for (const reaction of reactionFiles) {
      const aux = require("../exports/reactions/" + reaction)
      if (aux.methodName && aux.activated) {
        TiCu.Reactions[aux.methodName] = aux
      }
    }

    const autoFiles = fs.readdirSync(rootPath + "exports/auto/");
    for (const auto of autoFiles) {
      const aux = require("../exports/auto/" + auto)
      if (aux.methodName && aux.activated) {
        TiCu.Auto[aux.methodName] = aux
      }
    }
  },
  loadParsing: function() {
    global.parseMessage = (msg) => {
      if(!msg.author.bot) {
        let params = []
        let rawParams = []
        TiCu.Xp.processXpFromMessage("add", msg)
        if(msg.channel.type === "dm" ) {
          let user = tipoui.members.get(msg.author.id) ? tipoui.members.get(msg.author.id) : undefined
          if(user) {
            if(!user.roles.find(e => e === PUB.roles.quarantaineRole.id)) {
              let embed = createEmbedCopy(msg, user)
              tipoui.channels.get(PUB.salons.botsecret.id).send(embed)
                .then(() => TiCu.Log.DM(embed, msg))
            } else msg.reply("utilise plutôt <#" + PUB.salons.quarantaineUser.id + "> s'il te plaît. Ce message n'a pas été transmis.")
          } else msg.reply("je ne parle qu'aux gens de Tipoui ♥")
        } else if(msg.channel.id === PUB.salons.quarantaineUser.id || msg.channel.id === PUB.salons.quarantaineVigi.id) {
          if(msg.channel.id === PUB.salons.quarantaineUser.id) {
            let user = msg.member
            tipoui.channels.get(PUB.salons.quarantaineVigi.id).send(createEmbedCopy(user, msg))
              .then(newMsg => TiCu.Log.Quarantaine("reçu", newMsg, msg))
          } else if(msg.channel.id === PUB.salons.quarantaineVigi.id) {
            tipoui.channels.get(PUB.salons.quarantaineUser.id).send(msg.content)
              .then(newMsg => TiCu.Log.Quarantaine("envoyé", newMsg, msg))
          }
        } else if(msg.content.match(/^![a-zA-Z]/)) {
          msg.content.substring(1).match(/([^\\\s]?[\"][^\"]+[^\\][\"]|[^\s]+)/g).forEach(value => {
            if (value[0] === '"') {
              rawParams.push(value.substr(1, value.length-2))
              params.push(value.substr(1, value.length-2).toLowerCase())
            } else {
              rawParams.push(value.replace(/\\/g, ""))
              params.push(value.replace(/\\/g, "").toLowerCase())
            }
          })
          let cmd = params.shift()
          rawParams.shift()
          TiCu.Commands[cmd] ? TiCu.Authorizations.Command(cmd, msg) ? TiCu.Commands[cmd].run(params, msg, rawParams) : TiCu.Log.Error(cmd, "permissions manquantes", msg) : msg.react("❓")
        } else {
          parseForAutoCommands(msg)
        }
      }
    }

    global.parseMessageDelete = (msg) => {
      if(!msg.author.bot) {
        TiCu.Xp.processXpFromMessage("remove", msg)
      }
    }

    global.parseMessageUpdate = (oldMsg, newMsg) => {
      if(!oldMsg.author.bot) {
        TiCu.Xp.processXpMessageUpdate(oldMsg, newMsg)
        if(newMsg.channel.type === "dm" ) {
          let user = tipoui.members.get(newMsg.author.id) ? tipoui.members.get(newMsg.author.id) : undefined
          if(user) {
            if(!user.roles.find(e => e === PUB.roles.quarantaineRole.id)) {
              const previousBotEmbed = retrieveMessageForEdit(oldMsg, PUB.salons.botsecret.id)
              if (previousBotEmbed) {
                let embed = createEmbedCopy(newMsg, user, true, previousBotEmbed.embeds[0].description)
                previousBotEmbed.edit(embed).then(() => TiCu.Log.UpdatedDM(embed, newMsg))
              } else TiCu.Log.UpdatedDM(undefined, newMsg, "Could not find previous bot message to update")
            }
          }
        } else if(newMsg.channel.id === PUB.salons.quarantaineUser.id || newMsg.channel.id === PUB.salons.quarantaineVigi.id) {
          if (newMsg.channel.id === PUB.salons.quarantaineUser.id) {
            const previousBotEmbed = retrieveMessageForEdit(oldMsg, PUB.salons.quarantaineVigi.id)
            if (previousBotEmbed) {
              let embed = createEmbedCopy(newMsg, newMsg.member, true, previousBotEmbed.embeds[0].description)
              previousBotEmbed.edit(embed).then(msgEdited => TiCu.Log.UpdatedQuarantaine("reçu", msgEdited, newMsg))
            } else TiCu.Log.UpdatedQuarantaine("reçu", undefined, newMsg, "Could not find previous bot message to update")
          } else if(newMsg.channel.id === PUB.salons.quarantaineVigi.id) {
            const previousBotEmbed = retrieveMessageForEdit(oldMsg, PUB.salons.quarantaineUser.id)
            if (previousBotEmbed) {
              let embed = createEmbedCopy(newMsg, newMsg.member, true, previousBotEmbed.embeds[0].description)
              previousBotEmbed.edit(embed).then(msgEdited => TiCu.Log.UpdatedQuarantaine("envoyé", msgEdited, newMsg))
            } else TiCu.Log.UpdatedQuarantaine("envoyé", undefined, newMsg, "Could not find previous bot message to update")
          }
        }
      }
    }

    /**
     * Find the right reaction response and run the relevant command
     * @param reaction MessageReaction
     * @param usr User
     * @param type "add" | "remove"
     */
    global.parseReaction = (reaction, usr, type) => {
      if (!usr.bot && !reaction.message.author.bot && reaction.message.guild.id === PUB.servers.commu) {
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

    global.parseGuildMemberAdd = (usr) => {
      if (usr.guild.id === tipoui.id) {
        tipoui.channels.get(PUB.salons.genTP.id).send("Oh ! Bienvenue <@" + usr.id + "> ! Je te laisse lire les Saintes Règles, rajouter tes pronoms dans ton pseudo et nous faire une ptite présentation dans le salon qui va bien :heart:\nSi tu n'as pas fait vérifier ton numéro de téléphone ou d'abonnement Nitro, il va aussi te falloir aussi attendre 10 petites minutes que Discord s'assure tu n'es pas une sorte d'ordinateur mutant venu de l'espace... Même si en vrai ça serait trop cool quand même !")
        if (usr.lastMessage) {
          maxilog.send(TiCu.Date("log") + " : Retour de membre\n" + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
          minilog.send("Retour de " + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
        } else {
          maxilog.send(TiCu.Date("log") + " : Arrivée de membre\n" + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
          minilog.send("Arrivée de " + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
        }
      }
    }

    global.parseGuildMemberRemove = (usr) => {
      if(usr.guild.id === tipoui.id) {
        maxilog.send(TiCu.Date("log") + " : Départ de membre\n" + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
        minilog.send("Départ de " + usr.user.toString() + " - " + usr.user.tag + " - " + usr.id)
      }
    }

    global.parseGuildMemberUpdate = (oldUsr, newUsr) => {
      if(newUsr.roles.get(PUB.roles.turquoise.id) && !oldUsr.roles.get(PUB.roles.turquoise.id)) {
        newUsr.addRole(PUB.roles.turquoiseColor.id)
        newUsr.addRole(PUB.roles.vote.id)
        tipoui.channels.get(PUB.salons.genTutu.id).send("Bienvenue parmi les 💠Turquoises <@" + newUsr.id + "> ! <:turquoise_heart:417784485724028938>\nTu as désormais accès à de nouveaux salons, notamment <#453706061031931905> où tu pourras découvrir les spécificités de cette promotion. Par ailleurs, n'hésite pas à consulter <#453702956315836436> pour voir les rôles auxquels tu peux prétendre, et demande-les-moi par message privé.")
      }
      if(newUsr.roles.get(PUB.roles.luxure.id)) {
        if(!newUsr.roles.get(PUB.roles.hammer.id) && newUsr.roles.get(PUB.roles.demolisseureuse.id)) {newUsr.addRole(PUB.roles.hammer.id)}
        else if(newUsr.roles.get(PUB.roles.hammer.id) && !newUsr.roles.get(PUB.roles.demolisseureuse.id)) {newUsr.removeRole(PUB.roles.hammer.id)}
        if(!newUsr.roles.get(PUB.roles.naughty.id) && newUsr.roles.get(PUB.roles.grrrrl.id)) {newUsr.addRole(PUB.roles.naughty.id)}
        else if(newUsr.roles.get(PUB.roles.naughty.id) && !newUsr.roles.get(PUB.roles.grrrrl.id)) {newUsr.removeRole(PUB.roles.naughty.id)}
      } else if(oldUsr.roles.get(PUB.roles.luxure.id) && !newUsr.roles.get(PUB.roles.luxure.id)) {
        if(newUsr.roles.get(PUB.roles.hammer.id)) {newUsr.removeRole(PUB.roles.hammer.id)}
        if(newUsr.roles.get(PUB.roles.naughty.id)) {newUsr.removeRole(PUB.roles.naughty.id)}
      }
    }
  }
}
