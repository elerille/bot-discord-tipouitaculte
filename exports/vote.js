module.exports = {
  voteThreshold: function(type) {
    switch (type) {
      case "kick":
        return 8
      case "ban":
        return 12
      case "turquoise":
        return Math.floor(tipoui.roles.get(PUB.roles.vote.id).members.size*73/100)
      case "text":
      case "prop":
      default:
        return -1
    }
  },
  addReactionsToMessage: function(msg) {
    msg.react(VotesEmojis[0])
      .then(async function() {
        await msg.react(VotesEmojis[1])
        await msg.react(VotesEmojis[2])
        await msg.react(VotesEmojis[3])
      })
  },
  createJsonForAnonVote: function (target, type, msg) {
    let json = {"action": "write", "content" :{}}
    json.target = VotesFile
    json.content[msg.id] = {}
    json.content[msg.id].date = TiCu.Date("fr")
    json.content[msg.id].chan = msg.channel.id
    json.content[msg.id].type = type
    if(target) {json.content[msg.id].target = target.id}
    json.content[msg.id].threshold = this.voteThreshold(type)
    json.content[msg.id].votes = {"oui":[], "non":[], "blanc":[], "delai":[]}
    return json
  },
  autoTurquoise: function(targetId, voteNumber) {
    const targetMember = tipoui.members.get(targetId)
    if (targetMember && !targetMember.roles.get(PUB.roles.turquoise.id)) {
      tipoui.channels.get(PUB.salons.salleDesVotes.id).send(TiCu.VotesCollections.CreateEmbedAnon(targetMember, "auto", TiCu.Vote.voteThreshold("turquoise")))
        .then(newMsg => {
          if (TiCu.json(this.createJsonForAnonVote(targetMember, 'turquoise', newMsg))) {
            TiCu.Vote.addReactionsToMessage(newMsg)
            TiCu.VotesCollections.Init('turquoise', newMsg)
            TiCu.Log.Commands.Vote.AutoTurquoise(newMsg, targetId, voteNumber)
          } else TiCu.Log.XP.error(TiCu.Xp.errorTypes.AUTOVOTE, targetId)
        })
    }
  }
}
