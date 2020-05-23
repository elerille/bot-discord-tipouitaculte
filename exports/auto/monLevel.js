module.exports = {
  activated: true,
  methodName: 'monlevel',
  name : "Mon level ?",
  desc : "Affiche son niveau\n",
  schema: "mon level ?",
  trigger: /(mon|notre) (level|niveau)\s*\?/,
  authorizations : TiCu.Authorizations.getAuth("auto", "monlevel"),
  run : function(msg) {
    TiCu.Commands.level.run([], msg)
  }
}
