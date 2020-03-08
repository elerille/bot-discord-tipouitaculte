module.exports = {
  alias: [
    "vote"
  ],
  activated: true,
  name : "Vote",
  desc : "Lancer un vote public ou anonymisé, éventuellement pour kick/ban/turquoise.",
  schema : "!vote <anon|anonyme> <turquoise|kick|ban> <@>\nou\n!vote <anon|anonyme> <text> (texte)\nou\n!vote (texte)",
  authorizations : TiCu.Authorizations.getAuth("command", "vote"),
  run : function(params, msg) {
    let crop, target
    let anon = params[0] === "anon" || params[0] === "anonyme"
    let type = params[1]
    if(anon){
      if(type === "kick" || type === "ban") {
        if(msg.channel.id === PUB.salons.salleDesVotes.id || msg.channel.id === PUB.salons.automoderation.id) {
          if(params[2]) {target = TiCu.Mention(params[2])}
          else { return TiCu.Log.Error("vote", "les votes de kick et de ban nécessitent une cible")}
        } else {return TiCu.Log.Error("vote", `les votes de kick et de ban sont restreints aux salons <#${PUB.salons.automoderation.id}> et <#${PUB.salons.salleDesVotes.id}>`, msg)}
      } else if(type === "turquoise") {
        if(msg.channel.id === PUB.salons.salleDesVotes.id) {
          if(params[2]) {target = TiCu.Mention(params[2])}
          else { return TiCu.Log.Error("vote", "les votes de passage Turquoise nécessitent une cible")}
        } else {return TiCu.Log.Error("vote", `les votes de passage Turquoise sont restreints au salon <#${PUB.salons.salleDesVotes.id}>`, msg)}
      } else if(type !== "text") {return TiCu.Log.Error("vote", "type de vote anonyme invalide", msg)}
      if(typeof target != "object" && type !== "text") {return TiCu.Log.Error("vote", "cible invalide")}
      crop = new RegExp(dev ? /^%vote\s+[^\s]+\s+/ : /^!vote\s+[^\s]+\s+/)
      if(!msg.content.match(crop)) {return TiCu.Log.Error("vote", "paramètres manquants", msg)}
      const msgMatch = msg.content.match(/^!vote\s+anon\s+(text|kick|ban|turquoise)\s+(.+)/s)
      msg.channel.send(TiCu.VotesCollections.CreateEmbedAnon(target, type, TiCu.Vote.voteThreshold(type), undefined, undefined, msgMatch ? msgMatch[2] : undefined))
        .then(newMsg => {
          if(TiCu.json(TiCu.Vote.createJsonForAnonVote(target, type, newMsg))) {
            TiCu.Vote.addReactionsToMessage(newMsg)
            TiCu.VotesCollections.Init(type, newMsg)
            TiCu.Log.Commands.Vote.Anon(type, params, newMsg, msg)
          } else TiCu.Log.Error("vote", "erreur d'enregistrement du vote", msg)
        })
    } else if(msg.channel.id === PUB.salons.salleDesVotes.id) {return TiCu.Log.Error("vote", `seuls les votes anonymisés sont autorisés dans <#${PUB.salons.salleDesVotes.id}>`)}
    else {
      TiCu.Vote.addReactionsToMessage(msg)
      TiCu.Log.Commands.Vote.Public(msg)
    }
  }
}
