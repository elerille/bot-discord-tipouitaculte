module.exports = {
  activated: false,
  methodName: 'heart',
  name : "Heart",
  desc : "Very complex to trigger heart reaction",
  emoji: "❤️",
  authorizations : TiCu.Authorizations.getAuth("reaction", "heart"),
  run : function(reaction, usr, type) {
    TiCu.Log.Reactions.Heart(reaction, usr, type)
  }
}
