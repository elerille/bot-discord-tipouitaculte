const fs = require("fs")
const emojiTable = {};
emojiTable[VotesEmojis[0]] = "oui";
emojiTable[VotesEmojis[1]] = "non";
emojiTable[VotesEmojis[2]] = "blanc";
emojiTable[VotesEmojis[3]] = "delai";

function filterReactions(expectedEmojis) {
  return (reaction, user) => {return (!user.bot) && (expectedEmojis.includes(reaction.emoji.name))}
}
function updateVotes(reaction, collector) {
  let votesJSON = JSON.parse(fs.readFileSync(VotesFile))
  let msg = reaction.message
  let user
  for (const id of reaction.users.keyArray()) {
    if (id !== PUB.tipouitaculte) {
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
  fs.writeFileSync(VotesFile, JSON.stringify(votesJSON, null, 2))
  if (false /*TODO Condition d'arrêt du vote*/) {
    collector.stop("Ce vote est terminé")
  }
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
    switch(type) {
      case "ban":
        tipoui.members.get(target).ban()
          .then(() => TiCu.Log.VoteDone(reason, type, target, msg))
        break
      case "kick":
        tipoui.members.get(target).kick()
          .then(() => TiCu.Log.VoteDone(reason, type, target, msg))
        break
      case "turquoise":
        tipoui.members.get(target).addRoles([PUB.tipoui.turquoise, PUB.tipoui.turquoiseColor])
          .then(() => TiCu.Log.VoteDone(reason, type, target, msg))
        break
    }
  }
}
