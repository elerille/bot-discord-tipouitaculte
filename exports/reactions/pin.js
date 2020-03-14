const NUMBER_REACTIONS_FOR_ACTION = 5

module.exports = {
  activated: true,
  methodName: 'pin',
  name : "Pin",
  desc : "Pin le message quand suffisamment de gens sont d'accord pour le faire",
  emoji: "📌",
  authorizations : TiCu.Authorizations.getAuth("reaction", "pin"),
  run : function(reaction, usr, type) {
    if (type === "add" && reaction.count === NUMBER_REACTIONS_FOR_ACTION) {
      if (!reaction.message.pinned) {
        reaction.message.pin()
        TiCu.Log.Reactions.Pin(reaction.message)
      }
    }
  }
}
