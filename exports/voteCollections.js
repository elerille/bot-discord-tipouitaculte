const fs = require("fs")
const emojiTable = {};
emojiTable[VotesEmojis[0]] = "oui";
emojiTable[VotesEmojis[1]] = "non";
emojiTable[VotesEmojis[2]] = "blanc";
emojiTable[VotesEmojis[3]] = "delai";

const results = {
  oui: "Proposition validée",
  non: "Proposition rejetée",
  delai: "Proposition ajournée"
}

function filterReactions(expectedEmojis) {
  return (reaction, user) => {return (!user.bot) && (expectedEmojis.includes(reaction.emoji.name))}
}

function checkThreshold(vote, collector) {
  if (vote.threshold === -1) {
    return false
  }
  switch (vote.type) {
    case "ban":
    case "kick":
    case "text":
      if (vote.votes.oui.length >= vote.threshold) {
        collector.stop("oui")
      }
      break
    case "turquoise":
      let nbVotes = 0
      for (const votes of Object.values(vote.votes)) {
        nbVotes += votes.length
      }
      if (nbVotes >= vote.threshold) {
        const nbVotesDelay = vote.votes.delai.length
        if (nbVotesDelay >= nbVotes) {
          collector.stop("delai")
        } else if ((vote.votes.oui.length + (vote.votes.blanc.length + nbVotesDelay)/2) / nbVotes >= 0.75) {
          collector.stop("oui")
        } else {
          collector.stop("non")
        }
      }
      break
    default:
      if (vote.votes.oui.length >= vote.threshold) {
        collector.stop("oui")
      } else if (vote.votes.non.length >= vote.threshold) {
        collector.stop("non")
      } else if (vote.votes.delai.length >= vote.threshold) {
        collector.stop("delai")
      }
  }
}

function updateVotes(reaction, collector) {
  let votesJSON = JSON.parse(fs.readFileSync(VotesFile))
  let msg = reaction.message
  let user
  for (const id of reaction.users.keyArray()) {
    if (id !== PUB.users.tipouitaculte) {
      user = id
      reaction.remove(user)
      break
    }
  }
  let alreadyVoted
  for (const emojiType of Object.values(emojiTable)) {
    if (votesJSON[msg.id].votes[emojiType].includes(user)) {
      alreadyVoted = emojiType
    }
  }
  if (alreadyVoted) {
    votesJSON[msg.id].votes[alreadyVoted].splice(
      votesJSON[msg.id].votes[alreadyVoted].indexOf(user),
      1
    )
  }
  votesJSON[msg.id].votes[emojiTable[reaction.emoji.name]].push(user)
  if (votesJSON[msg.id].type === "turquoise" && emojiTable[reaction.emoji.name] !== alreadyVoted) {
    if (emojiTable[reaction.emoji.name] === "delai") {
      votesJSON[msg.id].threshold++
    } else if (alreadyVoted === "delai") {
      votesJSON[msg.id].threshold--
    }
  }
  fs.writeFileSync(VotesFile, JSON.stringify(votesJSON, null, 2))
  reaction.message.edit(
    updateEmbed(
      TiCu.VotesCollections.CreateEmbedAnon(
        tipoui.members.get(votesJSON[msg.id].target),
        votesJSON[msg.id].type,
        votesJSON[msg.id].threshold,
        votesJSON[msg.id]
      ),
      msg
    )
  )
  checkThreshold(votesJSON[msg.id], collector)
  TiCu.Log.VoteUpdate(user, emojiTable[reaction.emoji.name], msg)
}

function createCollector(type, msg) {
  TiCu.VotesCollections.Collectors[msg.id] = msg.createReactionCollector(filterReactions(VotesEmojis));
  TiCu.VotesCollections.Collectors[msg.id].on("collect", (reaction, collector) =>
    TiCu.VotesCollections.Collected(type, reaction, collector))
  TiCu.VotesCollections.Collectors[msg.id].on("end", (reactions, reason)  =>
    TiCu.VotesCollections.Done(type, reactions, reason, msg))
  TiCu.Log.VoteCollector(msg)
}

function first(indexes) {
  let res = [undefined, 7000]
  for (const emoji of Object.keys(indexes)) {
    if (indexes[emoji] < res[1]) {
      res = [emoji, indexes[emoji]]
    }
  }
  return res
}

function parseToDesc(voteDesc) {
  const indexes = {}
  for (const emoji of VotesEmojis) {
    const aux = voteDesc.indexOf(emoji)
    if (aux !== -1) {
      indexes[emoji] = aux
    }
  }
  let indexTab = []
  let length = Object.keys(indexes).length
  while(length > 0) {
    const aux = first(indexes)
    indexTab.push(aux)
    delete indexes[aux[0]]
    length--
  }
  return indexTab
}

function updateEmbed(embed, msg) {
  if (msg.embeds[0].description) {
    embed.setDescription(msg.embeds[0].description)
  }
  for (const emoji of VotesEmojis) {
    const aux = msg.embeds[0].fields.findIndex((v) => {return v.name.indexOf(emoji) !== -1})
    if (aux !== -1) {
      embed.fields[embed.fields.findIndex((v) => {return v.name === emoji})].name = msg.embeds[0].fields[aux].name
    }
  }
  return embed
}

module.exports = {
  Init : (type, msg) => {
    createCollector(type, msg)
  },
  Startup : () => {
    let votesJSON = JSON.parse(fs.readFileSync(VotesFile).toString());
    for (const [id, entry] of Object.entries(votesJSON)) {
      if (typeof entry === "object") {
        tipoui.channels.get(entry.chan).fetchMessage(id).then(msg => {
          createCollector(entry.type, msg);
        })
      }
    }
  },
  Collectors : {},
  Collected : (type, reaction, collector) => {
      updateVotes(reaction, collector)
  },
  Done : (type, reactions, reason, msg) => {
    let votesJSON = JSON.parse(fs.readFileSync(VotesFile))
    let target = votesJSON[msg.id].target
    if (reason === "oui") {
      switch (type) {
        case "ban":
          tipoui.members.get(target).ban()
            .then(() => TiCu.Log.VoteDone(reason, type, msg, target))
          break
        case "kick":
          tipoui.members.get(target).kick()
            .then(() => TiCu.Log.VoteDone(reason, type, msg, target))
          break
        case "turquoise":
          tipoui.members.get(target).addRoles([PUB.roles.turquoise.id, PUB.roles.turquoiseColor.id])
            .then(() => TiCu.Log.VoteDone(reason, type, msg, target))
          break
        case "text":
        default:
          TiCu.Log.VoteDone(reason, type, msg)
          break
      }
    } else {
      TiCu.Log.VoteDone(reason, type, msg, target)
    }
    msg.edit(
      updateEmbed(
        TiCu.VotesCollections.CreateEmbedAnon(
          tipoui.members.get(votesJSON[msg.id].target),
          votesJSON[msg.id].type,
          votesJSON[msg.id].threshold,
          votesJSON[msg.id],
          results[reason]
        ),
        msg
      )
    )
    delete votesJSON[msg.id]
    fs.writeFileSync(VotesFile, JSON.stringify(votesJSON, null, 2))
  },
  CreateEmbedAnon: (target, type, threshold, voteJson = undefined, result = undefined, msg = undefined) => {
    let nbVotes = 0
    let indexTab = []
    if (voteJson !== undefined) {
      for (const votes of Object.values(voteJson.votes)) {
        nbVotes += votes.length
      }
    }
    const embed = new DiscordNPM.RichEmbed()
    if (target) {
      embed.setAuthor(`Vote de ${type === "turquoise" ? "passage" : ""} ${type.toUpperCase()} pour ${target.displayName}`, target.user.avatarURL)
      embed.setColor(target.displayColor)
    } else {
      embed.setAuthor(`Vote Anonyme`)
      if (msg && msg.content) {
        const msgMatch = msg.content.match(/^!vote\s+anon\s+(text|kick|ban|turquoise)\s+(.+)/s)
        if (msgMatch && msgMatch.length === 3) {
          indexTab = parseToDesc(msgMatch[2])
          embed.setDescription(msgMatch[2].substr(0, indexTab[0][1]-1))
          for (const emoji of VotesEmojis) {
            const aux = indexTab.findIndex((v) => {return v[0] === emoji})
            let desc = emoji
            if (aux !== -1) {
              if (aux === indexTab.length-1) {
                desc = msgMatch[2].substr(indexTab[aux][1])
              } else {
                desc = msgMatch[2].substr(indexTab[aux][1], indexTab[aux+1][1]-indexTab[aux][1])
              }
            }
            embed.addField(desc, voteJson !== undefined ? voteJson.votes[emojiTable[emoji]].length : 0, emoji !== VotesEmojis[3])
          }
        }
      }
    }
    if (embed.fields.length === 0) {
      for (const emoji of VotesEmojis) {
        embed.addField(emoji, voteJson !== undefined ? voteJson.votes[emojiTable[emoji]].length : 0, emoji !== VotesEmojis[3])
      }
    }
    embed.addField("Votes nécessaires", threshold === -1 ? 'Vote sans limite' : threshold, true)
    embed.addField("Votes actuels", nbVotes, true)
    if (result !== undefined) {
      embed.addField("Résultat du vote", result)
    }
    return embed
  }
}
