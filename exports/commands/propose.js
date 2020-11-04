module.exports = {
  alias: [
    "propose",
    "proposer",
    "proposition"
  ],
  activated: true,
  name : "Proposer",
  desc : `Proposer une nouvelle fonctionnalité pour TipouiTaCulte ou la communauté, et la soumettre au vote dans <#${PUB.salons.whiteboard.id}>`,
  schema : "!<propose|proposer|proposition> <description>",
  authorizations : TiCu.Authorizations.getAuth("command", "propose"),
  run : function(params, msg, rawParams) {
    const type = "prop"
    let description = ""
    for (let i=0;i<rawParams.length;i++) {
      description += " " + rawParams[i]
    }
    tipoui.channels.resolve(PUB.salons.whiteboard.id).send(
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
  }
}
