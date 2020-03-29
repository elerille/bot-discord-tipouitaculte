function randomDice(nbFaces) {
  if (nbFaces === 2) {
    return Math.ceil(Math.random() * nbFaces) === 1 ? "pile" : "face"
  }
  return Math.ceil(Math.random() * nbFaces)
}

module.exports = {
  alias: [
    "roll",
    "lancer",
    "dice",
    "de"
  ],
  activated: true,
  name : "Lancer",
  desc : "Effectuer un lancer de dé(s)",
  schema : "!<lancer|roll|dice|de> (nombreDeDes) <nombreDeFaces>",
  authorizations : TiCu.Authorizations.getAuth("command", "roll"),
  run : function(params, msg) {
    if(params.length === 2 && params[0] > 0 && params[1] > 1) {
      let result = ""
      for(let i=0;i<Number(params[0]);i++) {
        result += `${randomDice(Number(params[1]))}\n`
      }
      msg.channel.send(result)
    } else if(params.length === 1 && params[0] > 1) {
      msg.channel.send(randomDice(Number(params[0])))
    } else return TiCu.Log.Error("lancer", "paramètres invalides", msg)
  }
}
