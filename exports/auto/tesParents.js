module.exports = {
  activated: true,
  methodName: 'tesParents',
  name : "Tes Parents ?",
  desc : "wesh læ bot, c'est qui tes parents?",
  schema: "mon level ?",
  trigger: /tes (parents|créateurs|créatrices|créateurices|devs|développeurs|développeuses|développeureuses)\s*\?/,
  authorizations : TiCu.Authorizations.getAuth("auto", "tesParents"),
  run : function(msg) {
    msg.channel.send("C'est Eva qui m'a donné naissance, mais c'est Syrinx qui s'occupe principalement de mon éducation et de me rendre aussi formidable que je le suis devenue !")
  }
}
