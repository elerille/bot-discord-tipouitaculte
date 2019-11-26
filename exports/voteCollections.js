function filterReactions(expectedEmojis) {
  return (reaction, user) => {return (!user.bot) && (expectedEmojis.includes(reaction.emoji.name))}
}
function updateVotes(reaction, msg) {
  let votesJSON = JSON.parse(fs.readFileSync("private/votes.json"))
  msg.reactions
  votesJSON[msg.id].votes.push()
  fs.writeFileSync("private/votes.json", JSON.stringify(votesJSON, null, 2))
  TiCu.Log.Prefixed.Vote.Anon(type, params, newMsg, msg)
}

module.exports = function() {
  return {
    Init : (type, expectedEmojis, msg) => {
      TiCu.VotesCollections.Collectors[msg.id] = msg.createReactionCollector(filterReactions(expectedEmojis))
      TiCu.VotesCollections.Collectors[msg.id].on("collect", (reaction) =>
        TiCu.VotesCollections.Collected(type, reaction, msg))
      TiCu.VotesCollections.Collectors[msg.id].on("end", (reaction, reason)  =>
        TiCu.VotesCollections.Done(type, reaction, reason, msg))
    },
    Startup : (file) => {},
    Collectors : {},
    Collected : (type, reaction, msg) => {
        return maxilog.send("collected " + type)
    },
    Done : (type, reaction, reason, msg) => {
        return maxilog.send("done with " + type)
    }
  }
}
