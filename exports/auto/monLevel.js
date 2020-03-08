module.exports = {
  activated: true,
  methodName: 'monLevel',
  name : "Mon level ?",
  desc : "wesh læ bot, c'est quoi mon level ?\n",
  schema: "mon level ?",
  trigger: /mon (level|niveau)\s*\?/,
  authorizations : TiCu.Authorizations.getAuth("auto", "monLevel"),
  run : function(msg) {
    TiCu.Commands.level.run([], msg)
  }
}
