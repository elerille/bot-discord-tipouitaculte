const fs = require("fs")
const emojiTable = {};
emojiTable[VotesEmojis[0]] = "oui";
emojiTable[VotesEmojis[1]] = "non";
emojiTable[VotesEmojis[2]] = "blanc";
emojiTable[VotesEmojis[3]] = "delai";


function filterReactions(expectedEmojis) {
  return (reaction, user) => {return (!user.bot) && (expectedEmojis.includes(reaction.emoji.name))}
}
function updateVotes(reaction) {
  let votesJSON = JSON.parse(fs.readFileSync(VotesFile));
  let msg = reaction.message;
  let user;
  for (const id of reaction.users.keyArray()) {
    if (id !== PUB.tipouitaculte) {
      user = id;
      reaction.remove(user);
      break;
    }
  }
  let alreadyVoted;
  for (const emojiType of Object.values(emojiTable)) {
    if (votesJSON[msg.id].votes[emojiType].includes(user)) {
      alreadyVoted = emojiType;
    }
  }
  if (alreadyVoted) {
    votesJSON[msg.id].votes[alreadyVoted].splice(
        votesJSON[msg.id].votes[alreadyVoted].indexOf(user),
        1
    );
  }
  votesJSON[msg.id].votes[emojiTable[reaction.emoji.name]].push(user);
  fs.writeFileSync(VotesFile, JSON.stringify(votesJSON, null, 2));
  //TODO LOGS sur les collected votes
  //TiCu.Log.Commands.Vote.Anon(type, params, newMsg)
}

function createCollector(type, msg) {
  TiCu.VotesCollections.Collectors[msg.id] = msg.createReactionCollector(filterReactions(VotesEmojis));
  TiCu.VotesCollections.Collectors[msg.id].on("collect", (reaction) =>
      TiCu.VotesCollections.Collected(type, reaction))
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
          //TODO LOGS sur le startup
          createCollector(entry.type, msg);
        })
      }
    }
  },
  Collectors : {},
  Collected : (type, reaction) => {
      updateVotes(reaction);
      return maxilog.send("collected " + type)
  },
  Done : (type, reaction, reason, msg) => {
      return maxilog.send("done with " + type)
  }
}
