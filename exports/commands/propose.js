module.exports = {
  alias: [
    "propose",
    "proposer",
    "proposition"
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.botsecret.id, PUB.salons.bots.id, PUB.salons.blueprint.id]
    },
    auths : {
      type: "any"
    },
    roles : {
      type: "any"
    },
    name : "Proposer",
    desc : "Proposer une nouvelle fonctionnalité à mettre au vote",
    schema : "!<propose|proposer|proposition> <(bot|tipouitaculte|ttc)> <description>",
  },
  run : function(params, msg, rawParams) {
    if (params.length < 2) TiCu.Log.Error("propose", "mauvais paramètres", msg)
    const type = "prop"
    let description = ""
    for (let i=1;i<rawParams.length;i++) {
      description += " " + rawParams[i]
    }
    switch (params[0]) {
      case "bot":
      case "tipouitaculte":
      case "ttc":
        tipoui.channels.get(PUB.salons.whiteboard.id).send(
          TiCu.VotesCollections.CreateEmbedAnon(
            undefined,
            type,
            TiCu.Vote.voteThreshold(type),
            undefined,
            undefined,
            description
          )
        )
          .then(newMsg => {
            if(TiCu.json(TiCu.Vote.createJsonForAnonVote(undefined, type, newMsg))) {
              TiCu.Vote.addReactionsToMessage(newMsg)
              TiCu.VotesCollections.Init(type, newMsg)
              TiCu.Log.Commands.Vote.Anon(type, params, newMsg, msg)
            } else TiCu.Log.Error("propose", "erreur d'enregistrement de la proposition", msg)
          })
        break
      default:
        TiCu.Log.Error("propose", "type de proposition non reconnu", msg)
    }
  }
}
