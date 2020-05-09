module.exports = {
  activated: true,
  methodName: 'monlevel',
  name : "Mon level ?",
  desc : "wesh læ bot, c'est quoi mon level ?\n",
  schema: "mon level ?",
  trigger: /(mon|notre) (level|niveau)\s*\?/,
  authorizations : TiCu.Authorizations.getAuth("auto", "monlevel"),
  run : function(msg) {
    TiCu.Commands.level.run([], msg)
  }
}
