const fs = require("fs")

function filterReactions(expectedEmojis) {
  return (reaction, user) => {return (!user.bot) && (expectedEmojis.includes(reaction.emoji.name))}
}
function updateVotes(reaction, msg) {
  let votesJSON = JSON.parse(fs.readFileSync(VotesFile))
  msg.reactions
  votesJSON[msg.id].votes.push()
  fs.writeFileSync("private/votes.json", JSON.stringify(votesJSON, null, 2))
  TiCu.Log.Commands.Vote.Anon(type, params, newMsg, msg)
}

function createCollector(type, msg) {
  TiCu.VotesCollections.Collectors[msg.id] = msg.createReactionCollector(filterReactions(VotesEmojis));
  TiCu.VotesCollections.Collectors[msg.id].on("collect", (reaction) =>
      TiCu.VotesCollections.Collected(type, reaction, msg))
  TiCu.VotesCollections.Collectors[msg.id].on("end", (reaction, reason)  =>
      TiCu.VotesCollections.Done(type, reaction, reason, msg))
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
  Collected : (type, reaction, msg) => {
      return maxilog.send("collected " + type)
  },
  Done : (type, reaction, reason, msg) => {
      return maxilog.send("done with " + type)
  }
}
